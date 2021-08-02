const _ = require("lodash");
const defaultConfig = require("./config.default");
const constants = require("../core/constants");

/**
 * Configuration for development environment
 */
let devConfig = {
  cors: {
    enabled: true,
    options: {
      origin: [process.env.ORIGIN_URL, "http://localhost:3000"],
      methods: "GET, POST, PATCH, DELETE",
      allowedHeaders: ["Accept", "Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 204,
    },
  },
  morgan: {
    format: (tokens, req, res) => {
      const url = tokens.url(req, res);
      return [
        tokens.method(req, res),
        `${url.substring(0, Math.min(75, url.length))}`,
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ");
    },
  },
  seed: {
    logging: true,
    users: [
      // Todo: add users
    ],
  },
};

devConfig = _.merge({}, defaultConfig, devConfig);

module.exports = devConfig;
