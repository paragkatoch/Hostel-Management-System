const mongoose = require("mongoose");
const Joi = require("joi");
const createError = require("http-errors");

const constants = require("../core/constants");
const config = require("../config");
const { email, generateMsg } = require("../core/sendgrid");
const { verifyToken } = require("../middleware/createAuthMiddleware");

const User = mongoose.model("User");
const { ERROR_MESSAGES, TOKEN_PURPOSE } = constants;

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
			return req.user.generateJwtToken(TOKEN_PURPOSE.CHANGE_PASSWORD);
		})
		.then(async (token) => {
			if (config.app.send_email) {
				const url = `${config.app.uri}/changepassword/${token}`;
				const msg = await generateMsg({
					to: req.user.email,
					subject: "Change password",
					html: `Click <a href=${url}>here</a> to set password for your account`,
				});
				email.send(msg);
			}
			return token;
		})
		.then((token) => {
			req.user.save();
			if (config.app.send_email)
				res.status(201).json({ status: "email sent successfully" });
			else res.status(201).json({ status: "email sent successfully", token });
		})
		.catch(next);
};

/**
 * JOI schema for changePassword token validation
 */
const changePasswordTokenSchema = Joi.object({
	token: Joi.string().required(),
});

/**
 * Validates token and find user
 *  if found then adds user to req.user
 *
 * @param {String} req.params.token token
 * @param {String} select select fields
 * @returns {Promise} resolves with null
 */
function validateChangePasswordTokenAsync(req, select = "") {
	return new Promise((resolve, reject) => {
		changePasswordTokenSchema
			.validateAsync(req.params)
			.then((payload) =>
				verifyToken(payload.token, TOKEN_PURPOSE.CHANGE_PASSWORD)
			)
			.then(async (jwtPayload) =>
				User.findOne({
					_id: jwtPayload.userId,
					token: jwtPayload.token,
				}).select(select)
			)
			.then((user) => {
				if (!user) throw createError(401, "invalid token");
				req.user = user;
				resolve();
			})
			.catch(reject);
	});
}

/**
 * Checks changePassword token
 */
module.exports.changePasswordCheck = function (req, res, next) {
	validateChangePasswordTokenAsync(req)
		.then(() => {
			res.status(202).json({ status: "valid token" });
		})
		.catch(next);
};

/**
 * JOI schema for change password body validation
 */
const changePasswordBodySchema = Joi.object({
	password: Joi.string().min(8).required().strict(),
	confirmPassword: Joi.string()
		.valid(Joi.ref("password"))
		.required()
		.strict()
		.messages(ERROR_MESSAGES.CHANGE_PASSWORD),
});

/**
 * Checks changePassword token
 * if valid then changes the user password and
 * invalidates all issued tokens
 *
 * @param {String} req.body.password
 * @param {String} req.body.confirmPassword
 */
module.exports.changePassword = function (req, res, next) {
	changePasswordBodySchema
		.validateAsync(req.body)
		.then((payload) => {
			req.body = payload;
			return validateChangePasswordTokenAsync(
				req,
				"token hashedPassword status"
			);
		})
		.then(() => {
			req.user.clearToken();
			req.user.status = constants.ACCOUNT_STATUS.ACTIVE;
			req.user.setPasswordAsync(req.body.password).then(() => {
				req.user.save();
			});
			res.status(202).json({ status: "password change successfully" });
		})
		.catch(next);
};
