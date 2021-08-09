const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const createError = require("http-errors");
const chalk = require("chalk");

const config = require("../config");
const constants = require("./constants");
const routes = require("../routes/index");

const app = express();

// Logger
if (config.morgan.enabled) {
	app.use(morgan(config.morgan.format));
}

// cors
if (config.cors.enabled) {
	app.use(cors(config.cors.options));
}

// Secure app by setting various HTTP headers
if (config.helmet.enabled) {
	app.use(helmet(config.helmet.options));
}

// Support parsing of application/x-www-form-urlencoded post data
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(routes);

// Create 404 error and forward to error handler
app.use((req, res, next) => {
	next(createError(404, "Not Found"));
});

// error handler
if (config.env === constants.ENV.DEV) {
	// prints stack-trace during development
	// and send stack-trace to client
	app.use((err, req, res, next) => {
		console.log(chalk.red(`[DEV]`, err.stack));
		res.status(err.status || 400).json({
			error: { message: err.message, details: err.stack },
		});
		next();
	});
} else {
	// no stack-trace to client
	app.use((err, req, res, next) => {
		res.status(err.status || 400).json({ error: { message: err.message } });
		// TODO send mail to the owner
		next();
	});
}

module.exports = app;
