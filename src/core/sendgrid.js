const email = require("@sendgrid/mail");
const Joi = require("joi");
const config = require("../config");

email.setApiKey(config.keys.sendGrid);

// TODO: add email templates

/**
 * JOI schema to validate email msg data
 */
const generateMsgSchema = Joi.object({
	to: Joi.string().required(),
	subject: Joi.string().required(),
	html: Joi.string().required(),
});

/**
 * function to create email msg
 *
 * @param {Object} data
 * @param {String} data.to
 * @param {String} data.subject
 * @returns {Promise} resolves with msg object
 */
const generateMsg = (data) =>
	new Promise((resolve, reject) => {
		generateMsgSchema
			.validateAsync(data)
			.then((payload) => {
				const msg = {
					to: payload.to,
					from: `${config.app.email_name} <${config.app.email}>`,
					subject: `${config.app.title} - ${payload.subject}`,
					html: payload.html,
				};
				resolve(msg);
			})
			.catch(reject);
	});

module.exports = {
	email,
	generateMsg,
};
