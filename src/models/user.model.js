const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const constants = require("../core/constants");
const config = require("../config");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "username is required"],
		trim: true,
		lowercase: true,
		unique: true,
	},
	firstName: {
		type: String,
		required: [true, "firstName is required"],
		trim: true,
	},
	lastName: {
		type: String,
		required: [true, "lastName is required"],
		trim: true,
	},
	dob: Date,
	contactNumber: {
		type: Number,
		trim: true,
		required: [true, "contact number is required"],
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		required: [true, "email is required"],
		match: [
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Invalid email",
		],
	},
	parentInfo: {
		father: {
			name: String,
			contactNumber: Number,
		},
		mother: {
			name: String,
			contactNumber: Number,
		},
		guardian: {
			name: String,
			contactNumber: Number,
		},
		address: String,
	},
	college: {
		degree: String,
		year: Number,
		branch: String,
	},
	hostel: {
		name: String,
		floor: Number,
		room: Number,
	},

	// hashedPassword - don't access directly,
	// use setPasswordAsync and comparePasswordAsync
	hashedPassword: String,

	// Role of the user
	// role will determine mine powers of the user
	role: {
		type: String,
		enum: [constants.ROLE.ADMIN, constants.ROLE.ROOT, constants.ROLE.USER],
		default: constants.ROLE.USER,
	},

	// TODO checkout for conditional fields https://mongoosejs.com/docs/discriminators.html

	// permission for the user set by root and admin
	permissions: {
		complaints: { type: Boolean, default: false },
		announcements: { type: Boolean, default: false },
		user: { type: Boolean, default: false },
		attendance: { type: Boolean, default: false },
	},

	// status of user account, set by root and admin
	// and changed to active on account creation
	status: {
		type: String,
		enum: [
			constants.ACCOUNT_STATUS.ACTIVE,
			constants.ACCOUNT_STATUS.DISABLED,
			constants.ACCOUNT_STATUS.UNINITIALIZED,
		],
		default: constants.ACCOUNT_STATUS.UNINITIALIZED,
	},

	// token is the single source of truth for jwt tokens
	// if changed all jwt tokens will get invalid
	// do change directly use setToken and clearToken methods
	token: { type: String },
});

// Methods

/**
 * function to give unsensitive user data
 *
 * @param {Object} user user requesting for user's data
 * @returns return user profile without sensitive info
 * such as hashedPassword and token
 */
userSchema.methods.toJsonFor = function (user) {
	const userObj = this.toObject();
	let userData;

	if (user && (user.hasPermission("user") || user._id === this._id)) {
		const { hashedPassword, token, ...rest } = userObj;
		userData = rest;
	} else {
		userData = {
			id: userObj._id,
			username: userObj.username,
			firstName: userObj.firstName,
			lastName: userObj.lastName,
		};
	}
	return userData;
};

/**
 * Set password for the user
 * The password will be hashed and stored to
 * the hashedPassword filed
 *
 * call this function for setting user's Password
 *
 * @param {String} password password to be hashed
 * @returns {Promise} Resolves with null value
 */
userSchema.methods.setPasswordAsync = function (password) {
	const saltRounds = 10;
	return bcrypt.hash(password, saltRounds).then((hash) => {
		this.hashedPassword = hash;
	});
};

/**
 * Compare candidate password with the stored hashedPassword
 *
 * @param {String} candidatePassword The candidate password
 * @returns {Promise} Resolves with a boolean value
 */
userSchema.methods.comparePasswordAsync = function (candidatePassword) {
	if (!this.hashedPassword) return Promise.resolve(false);
	return bcrypt.compare(candidatePassword, this.hashedPassword);
};

/**
 * Generate Jwt token for authorization or changepassword
 * uses token field to generate new token
 * use clearToken to invalidate all jwt tokens
 *
 * @param {String} purpose purpose for the creation
 *  of Jwt-token {authorization or changepassword}
 * @returns {String} A string containing jwt token
 */
userSchema.methods.generateJwtToken = function (purpose) {
	const iat = Math.floor(Date.now() / 1000);
	if (!this.token) throw new Error("token undefined");

	const signedToken = jsonwebtoken.sign(
		{ userId: this._id, token: this.token, purpose, iat },
		config.keys.priv_key,
		{
			expiresIn: config.token.expire[purpose],
			algorithm: config.token.algorithm,
		}
	);
	return signedToken;
};

/**
 * set's new token
 */
userSchema.methods.setToken = function () {
	this.token = uuidv4();
};

/**
 * Clear token with this method
 */
userSchema.methods.clearToken = function () {
	this.token = undefined;
};

/**
 * Determine whether this user has a permission
 * based on user's role and permissions properties
 *
 * @param {string} permission A permission
 * @returns {boolean} true if this user has the given permission.
 * Otherwise, false
 */
userSchema.methods.hasPermission = function (permission) {
	if (this.role === constants.ROLE.ROOT || this.role === constants.ROLE.ADMIN)
		return true;

	return this.permissions[permission];
};

mongoose.model("User", userSchema);
