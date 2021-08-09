const constants = require("../core/constants");

/**
 * Default configuration
 */
const defaultConfig = {
	app: {
		name: "hms",
		title: "Hostel Management System",
		uri: "[OVERRIDDEN] uri for the frontend",
		email: "[OVERRIDDEN] email of the app",
		email_name: "[OVERRIDDEN] host name for the email",
		send_email: false,
	},
	env: "[OVERRIDDEN] current environment",
	keys: {
		priv_key: "[OVERRIDDEN]",
		pub_key: "[OVERRIDDEN]",
		sendGrid: "[OVERRIDDEN]",
	},
	cors: {
		enabled: true,
		options: null,
	},
	helmet: {
		enabled: true,
		options: {},
	},
	morgan: {
		enabled: true,
		format: constants.MORGAN_FORMAT.DEV,
	},
	mongo: {
		uri: "[OVERRIDDEN] Mongodb database uri",
	},
	seed: {
		logging: true,
		users: [],
	},
	server: {
		port: 2606, // Can be overridden by .env variable PORT
	},
	token: {
		expire: {
			authentication: "7d",
			changePassword: "3h",
		},
		algorithm: "RS256",
	},
};

module.exports = defaultConfig;
