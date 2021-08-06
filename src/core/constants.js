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
	UNINITIALIZE: "uninitialize",
};
const COMPLAINT_STATUS = {
	NEW: "new",
	WORKING: "working",
	UNACCEPTED: "unaccepted",
	ACCEPTED: "accepted",
};

const VOTE_INCREMENT = "increment";
const VOTE_DECREMENT = "decrement";

module.exports = {
	ENV,
	MORGAN_FORMAT,

	ROLE,

	ACCOUNT_STATUS,
	COMPLAINT_STATUS,

	VOTE_DECREMENT,
	VOTE_INCREMENT,
};
