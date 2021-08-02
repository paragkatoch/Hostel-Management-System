const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("../config");

require("../models");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(config.mongo.uri);

mongoose.connection.once("open", () => {
  // seed.createUsers(config.seed.users);
  console.log(chalk.green("[*] connected to the database"));
});

mongoose.connection.on("error", () => {
  console.log(chalk.red("[-] Unable to connect to Mongo instance"));
});
