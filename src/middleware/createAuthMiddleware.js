const mongoose = require("mongoose");
const createError = require("http-errors");
const jsonwebtoken = require("jsonwebtoken");

const config = require("../config");
const constants = require("../core/constants");

const User = mongoose.model("User");

/**
 * Authenticates user based on username, password and status
 * adds user to req.user
 *
 * @param {String} req.body.username
 * @param {String} req.body.password
 */
function localAuthentication(req, res, next) {
	User.findOne({
		username: req.body.username,
		status: { $ne: constants.ACCOUNT_STATUS.UNINITIALIZED },
	})
		.then(async (user) => {
			if (!user) next(createError(404, "User not found"));
			const isMatched = await user.comparePasswordAsync(req.body.password);

			if (!isMatched) throw createError(403, "Incorrect password");
			if (user.checkStatus(constants.ACCOUNT_STATUS.DISABLED))
				throw createError(403, "Account is disabled");

			req.user = user;
			next();
		})
		.catch(next);
}

/**
 * Verify jwt token
 *
 * @param {String} token token to be verified
 * @param {String} purpose purpose of the token
 * @returns {Promise} a promise which
 * resolves with token payload
 */
module.exports.verifyToken = function (token, purpose) {
	return new Promise((resolve, reject) => {
		try {
			if (!token || token.split(" ")[0] !== "Bearer")
				throw createError(401, "Token not found");

			const payload = jsonwebtoken.verify(
				token.split(" ")[1],
				config.keys.pub_key,
				{ algorithm: config.token.algorithm }
			);

			if (payload.purpose !== purpose) throw createError(401, "Invalid token");

			resolve(payload);
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Authenticates user based on bearer token and status
 * adds user to req.user
 *
 * @param {String} req.headers.authorization
 */
function JwtAuthentication(req, res, next) {
	exports
		.verifyToken(req.headers.authorization, constants.TOKEN_PURPOSE.AUTH)
		.then((payload) =>
			User.findOne({ _id: payload.userId, token: payload.token })
		)
		.then((user) => {
			if (!user) throw createError(401, "Invalid token");
			if (user.checkStatus(constants.ACCOUNT_STATUS.DISABLED))
				throw createError(403, "Account is disabled");

			req.user = user;
			next();
		})
		.catch(next);
}

/**
 * Creates authentication middleware
 *
 * @param {String} type type of authentication middleware required
 * @returns authentication middleware based on type
 */
module.exports.createAuth = function (type) {
	if (type === "local") return localAuthentication;
	else if (type === "jwt") return JwtAuthentication;
	else throw new Error("invalid auth type");
};
