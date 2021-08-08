const mongoose = require("mongoose");
const createError = require("http-errors");
const jsonwebtoken = require("jsonwebtoken");

const config = require("../config");
const constants = require("../core/constants");

const User = mongoose.model("User");

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

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		try {
			if (!token || token.split(" ")[0] !== "Bearer")
				throw createError(401, "Token not found");

			const payload = jsonwebtoken.verify(
				token.split(" ")[1],
				config.keys.pub_key,
				{ algorithm: config.token.algorithm }
			);

			if (payload.purpose !== constants.TOKEN_PURPOSE.AUTH)
				throw createError(401, "Invalid token");

			resolve(payload);
		} catch (err) {
			reject(err);
		}
	});
}

function JwtAuthentication(req, res, next) {
	verifyToken(req.headers.authorization)
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

module.exports = function authenticationMiddleware(type) {
	if (type === "local") return localAuthentication;
	else if (type === "jwt") return JwtAuthentication;
	else throw new Error("invalid auth type");
};
