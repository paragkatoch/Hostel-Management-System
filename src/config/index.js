const path = require("path");
const dotenv = require("dotenv");
const _ = require("lodash");
const Joi = require("joi");
const chalk = require("chalk");

const constants = require("../core/constants");
const configDev = require("./config.dev");
const configProd = require("./config.prod");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Joi schema for validating environment variables
 */
const envVarsSchema = Joi.object({
  MONGO_URI: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid(constants.ENV_DEV, constants.ENV_PROD)
    .required(),
}).unknown();

// Validation
const { value, error } = envVarsSchema.validate(process.env);
if (error) {
  console.log(
    chalk.red(
      '\n[-] Invalid environment variables. Please edit the ".env" file and restart the process.'
    )
  );
  throw new Error(error.message);
}

const envConfig = {
  env: value.NODE_ENV,
  mongo: {
    uri: value.MONGO_URI,
  },
};

// Final config
let config = envConfig.env === constants.ENV_DEV ? configDev : configProd;

config = _.merge({}, config, envConfig);

module.exports = config;
