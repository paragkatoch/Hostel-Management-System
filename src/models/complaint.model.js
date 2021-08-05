const mongoose = require("mongoose");

const constants = require("../core/constants");

const status = constants.COMPLAINT_STATUS;

const complaintResponsesSchema = new mongoose.Schema({
	response: {
		type: String,
		trim: true,
		minLength: [30, "response length should atleast be 30"],
		required: [true, "response is required"],
	},
	// user who responded on the complaint
	// contains _id of the user from the User collection
	user: {
		type: mongoose.SchemaType.ObjectId,
		required: true,
	},
	createdAt: Date,
	updatedAt: Date,
});

const complaintSchema = new mongoose.Schema({
	heading: {
		type: String,
		required: [true, "heading is required"],
		trim: true,
		minLength: [10, "heading length should atleast be 10"],
	},
	description: {
		type: String,
		required: [true, "description is required"],
		trim: true,
		minLength: [30, "description length should atleast be 30"],
	},

	// Number of votes for the complaint
	votes: {
		type: Number,
		defualt: 0,
	},

	// voters list on the complaint
	// contains an array of users _id from User collection
	voteList: {
		type: [mongoose.SchemaTypes.ObjectId],
		default: [],
	},

	// responses on the complaint
	// contains an array _id of documents in ComplaintResponse collection
	responses: {
		type: [mongoose.SchemaTypes.ObjectId],
		default: [],
	},

	// status of the complaint
	// NEW - new complaint without any action
	// WORKING - complaint listened and action is being performed on it
	// UNACCEPTED - action done by the authorities but, not accepted by the user
	// ACCEPTED - action accpted by the user
	status: {
		type: String,
		enum: [status.NEW, status.WORKING, status.UNACCEPTED, status.ACCEPTED],
		default: status.NEW,
	},

	// user who created the complaint
	// contains user's _id from User collection
	user: {
		type: mongoose.SchemaType.ObjectId,
		required: true,
	},
	createdAt: Date,
	updatedAt: Date,
});

/**
 * updates createdAt and updatedAt fields
 *
 * @param {function} next
 */
function setDate(next) {
	const date = new Date();
	this.updatedAt = date;
	if (!this.createdAt) this.createdAt = date;
	next();
}

complaintResponsesSchema.pre("save", setDate);
complaintSchema.pre("save", setDate);

/**
 * increment or decrement votes and edit voteList based on votes
 *
 * @param {String} userId _id of the voter
 * @param {String} method method to implement on votes
 */
complaintSchema.methods.AlterVotes = function (userId, method) {
	if (method === constants.VOTE_INCREMENT) {
		this.voteList.push(userId);
		this.votes += 1;
	} else {
		this.voteList = this.voteList.filter((id) => id !== userId);
		this.votes -= 1;
	}
};

mongoose.model("ComplaintResponse", complaintResponsesSchema);
mongoose.model("Complaint", complaintSchema);
