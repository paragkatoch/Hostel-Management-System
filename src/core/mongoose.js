const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("../config");
const seed = require("./seed");

require("../models");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

mongoose.connect(config.mongo.uri);

mongoose.connection.once("open", () => {
	console.log(chalk.green("[*] connected to the database."));
	seed.seedUsers(config.seed.users);
});

mongoose.connection.on("error", (err) => {
	console.log(chalk.red("[-] Unable to connect to Mongo instance"));
	throw new Error(err);
});
