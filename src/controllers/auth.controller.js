const mongoose = require("mongoose");
const Joi = require("joi");
const createError = require("http-errors");
const constants = require("../core/constants");
const config = require("../config");

const User = mongoose.model("User");
const { ERROR_MESSAGES } = constants;

/**
 * JOI schema for validating login payload
 */
const loginSchema = Joi.object({
	username: Joi.string()
		.required()
		.length(12)
		.messages(ERROR_MESSAGES.USERNAME),
	password: Joi.string().required().min(8).messages(ERROR_MESSAGES.PASSWORD),
});

/**
 * Validates login payload
 *
 * @param {String} req.body.username
 * @param {String} req.body.password
 */
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

/**
 * JOI schema for validating signup payload
 */
const signupSchema = Joi.object({
	username: Joi.string()
		.required()
		.length(12)
		.messages(ERROR_MESSAGES.USERNAME),
});

/**
 * Validates signup payload
 *
 * @param {String} req.body.username
 */
module.exports.validateSignupPayload = function (req, res, next) {
	signupSchema
		.validateAsync(req.body)
		.then((payload) => {
			req.body = payload;
			next();
		})
		.catch(next);
};

/**
 * Responses with changepassword email
 */
module.exports.signup = function (req, res, next) {
	User.findOne({ username: req.body.username }, "email status")
		.then((user) => {
			if (!user) throw createError(404, "User not found");

			if (!user.checkStatus(constants.ACCOUNT_STATUS.UNINITIALIZED))
				throw createError(409, "Account already exists");

			req.user = user;
		})
		.then(() => {
			if (!req.user.token) req.user.setToken();

			return req.user.generateJwtToken(constants.TOKEN_PURPOSE.CHANGE_PASSWORD);
		})
		.then((token) => {
			const url = `${config.uri}/changepassword/${token}`;
			// Todo: send user an email with token
		})
		.then(() => {
			res.status(201).json({ status: "email sent successfully" });
		})
		.catch(next);
};
