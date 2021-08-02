const express = require("express");
const api = require("./api");

const Router = express.Router();

Router.use("/api", api);

module.exports = Router;
