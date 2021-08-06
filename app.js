const http = require("http");
const chalk = require("chalk");

const config = require("./src/config");

// models
require("./src/core/mongoose");

const app = require("./src/core/express");

http.createServer(app).listen(config.server.port || 2606, (err) => {
	if (err)
		console.log(
			chalk.red(
				`\n[-] Error occured while starting sever on PORT:${config.server.port}`
			)
		);

	console.log(
		chalk.green(`\n[*] API server is listening on port ${config.server.port}`)
	);
});
