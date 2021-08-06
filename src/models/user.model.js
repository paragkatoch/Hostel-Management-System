const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const constants = require("../core/constants");
const config = require("../config");

const userSchema = new mongoose.Schema({
	// Personal info of the user
	userId: {
		type: String,
		required: [true, "userId is required"],
		trim: true,
		lowercase: true,
		unique: true,
	},
	firstName: {
		type: String,
		required: [true, "firstname is required"],
		trim: true,
	},
	lastName: {
		type: String,
		required: [true, "lastname is required"],
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
	// use setPasswordAsync and comparePasswordAsync to accessit
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

	// status of user account, set by root and admin and changed to active on account creation
	status: {
		type: String,
		enum: [
			constants.ACCOUNT_STATUS.ACTIVE,
			constants.ACCOUNT_STATUS.DISABLED,
			constants.ACCOUNT_STATUS.UNINITIALIZE,
		],
		default: constants.ACCOUNT_STATUS.UNINITIALIZE,
	},

	// token for changePassword request
	// do set directly, instead use settoken and cleartoken methods
	token: { type: String },
});

// Methods

/**
 * Set password for the user
 * The password will be hashed and stored to the hashedPassword filed
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
 *
 * @param {String} purpose purpose for the creation of Jwt-token {authorization or changepassword}
 * @returns {String} A string conataining jwt token
 */
userSchema.methods.generateJwtToken = function (
	purpose = config.token.purpose.auth
) {
	const iat = Math.floor(Date.now() / 1000);

	const signedToken = jsonwebtoken.sign(
		{ userId: this._id, purpose, iat },
		config.key.priv,
		{
			expiresIn: config.token.expire[purpose],
			algorithm: config.token.algorithm,
		}
	);
	return signedToken;
};

/**
 * Generate a new jwt token for password change and set it to token field
 * call it for creating token
 * @returns {String} A string having token for changepassword
 */
userSchema.methods.setToken = function () {
	this.token = this.generateJwtToken(config.token.purpose.changePassword);
	return this.token;
};

/**
 * Clear token with this method
 */
userSchema.methods.clearToken = function () {
	this.token = undefined;
};

mongoose.model("User", userSchema);
