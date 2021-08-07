const constants = require("../core/constants");

/**
 * Default configuration
 */
const defaultConfig = {
	app: {
		name: "hms",
		title: "Hostel Management System",
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
		uri: "This will be overridden by .env variable MONGO_URI",
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
			changepassword: "3h",
		},
		algorithm: "RS256",
	},
};

module.exports = defaultConfig;
