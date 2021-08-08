const mongoose = require("mongoose");
const Joi = require("joi");
const constants = require("../core/constants");

const { ERROR_MESSAGES } = constants;

const loginSchema = Joi.object({
	username: Joi.string()
		.required()
		.length(12)
		.messages(ERROR_MESSAGES.USERNAME),
	password: Joi.string().required().min(8).messages(ERROR_MESSAGES.PASSWORD),
});

module.exports.validateLoginPayload = function (req, res, next) {
	loginSchema
		.validateAsync(req.body)
		.then((payload) => {
			req.body = payload;
			next();
		})
		.catch(next);
};

/**
 * @function login
 * Response with userInfo
 */
module.exports.login = function (req, res) {
	if (!req.user.token) {
		req.user.setToken();
		req.user.save();
	}

	res.status(200).json({
		token: req.user.generateJwtToken(constants.TOKEN_PURPOSE.AUTH),
		user: req.user.toJsonFor(req.user),
	});
};

module.exports.logout = function (req, res) {
	req.user.clearToken();
	req.user.save();
	res.status(200).json({ status: "Logged out successfully" });
};
