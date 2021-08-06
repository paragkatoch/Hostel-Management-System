const mongoose = require("mongoose");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const config = require("../config");

module.exports.seedUsers = async (users) => {
	const User = mongoose.model("User");
	const saltRounds = 10;

	const hashedUsers = await Promise.all(
		users.map(async (user) => {
			const { password, ...userData } = user;
			userData.hashedPassword = await bcrypt.hash(user.password, saltRounds);

			return {
				replaceOne: {
					upsert: true,
					filter: {
						userId: userData.userId,
					},
					replacement: userData,
				},
			};
		})
	);

	await User.bulkWrite(hashedUsers);

	if (config.seed.logging)
		console.log(chalk.green("[*] users seeding successful.\n"));
};
