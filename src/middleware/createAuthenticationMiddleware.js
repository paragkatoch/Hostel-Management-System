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

			if (!isMatched) return next(createError(403, "Incorrect password"));

			if (user.status === constants.ACCOUNT_STATUS.DISABLED)
				return next(403, "Account is disabled");

			req.user = user;
			return next();
		})
		.catch(next);
}

function verifyToken(token, next) {
	if (!token || token.split(" ")[0] !== "Bearer") {
		return next(createError(401, "Token not found"));
	}

	return jsonwebtoken.verify(
		token.split(" ")[1],
		config.keys.pub_key,
		{
			algorithm: config.token.algorithm,
		},
		(err, payload) => {
			if (err) return next(err);
			return payload;
		}
	);
}

function JwtAuthentication(req, res, next) {
	const payload = verifyToken(req.headers.authorization, next);

	User.findOne({ _id: payload.userId, token: payload.token }).then((user) => {
		if (!user) return next(createError(401, "Invalid token"));
		req.user = user;
		return next();
	});
}

module.exports = function authenticationMiddleware(type) {
	if (type === "local") return localAuthentication;
	return JwtAuthentication;
};
