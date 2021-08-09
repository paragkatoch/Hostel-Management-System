const _ = require("lodash");
const defaultConfig = require("./config.default");
const constants = require("../core/constants");

/**
 * Configuration for Production environment
 */
let prodConfig = {
	cors: {
		enabled: false,
	},
	morgan: {
		enabled: true,
		format: constants.MORGAN_FORMAT.COMBINED,
	},
	seed: {
		logging: true,
		users: [
			// TODO: add users
		],
	},
};

prodConfig = _.merge({}, defaultConfig, prodConfig);

module.exports = prodConfig;
