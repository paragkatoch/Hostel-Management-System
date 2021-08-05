const ENV = {
	DEV: "development",
	PROD: "production",
};

const MORGAN_FORMAT = {
	COMBINED: "combined",
	DEV: "dev",
};

const ROLE = {
	ADMIN: "admin",
	ROOT: "root",
	USER: "user",
};
const USER_STATUS = {
	DISABLED: "disabled",
	ACTIVE: "active",
	UNINITIALIZE: "uninitialize",
};

module.exports = {
	ENV,
	MORGAN_FORMAT,

	ROLE,

	USER_STATUS,
};
