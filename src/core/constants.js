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
const ACCOUNT_STATUS = {
	DISABLED: "disabled",
	ACTIVE: "active",
	UNINITIALIZED: "uninitialized",
};
const COMPLAINT_STATUS = {
	NEW: "new",
	WORKING: "working",
	UNACCEPTED: "unaccepted",
	ACCEPTED: "accepted",
};

const ERROR_MESSAGES = {
	USERNAME: {
		"string.empty": "Username cannot be empty",
		"string.length": "Invalid username",
		"any.required": "Username is required",
	},
	PASSWORD: {
		"string.empty": "Password cannot be empty",
		"string.min": "Password must at least be 8 character",
		"any.required": "Password is required",
	},
};

const TOKEN_PURPOSE = {
	AUTH: "authentication",
	CHANGE_PASSWORD: "changePassword",
};

const VOTE_INCREMENT = "increment";
const VOTE_DECREMENT = "decrement";

module.exports = {
	ENV,
	MORGAN_FORMAT,

	ROLE,
	ERROR_MESSAGES,
	TOKEN_PURPOSE,

	ACCOUNT_STATUS,
	COMPLAINT_STATUS,

	VOTE_DECREMENT,
	VOTE_INCREMENT,
};
