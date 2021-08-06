const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
	heading: {
		type: String,
		required: [true, "heading is required"],
		trim: true,
		minLength: [10, "heading length should atleast be 10"],
	},
	description: {
		type: String,
		trim: true,
		minLength: [30, "description length should atleast be 30"],
	},

	// user who created the announcement
	// contains user's _id from User collection
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
	},
	createdAt: Date,
});

announcementSchema.pre("save", function (next) {
	if (!this.createdAt) this.createdAt = new Date();
	next();
});

mongoose.model("Announcement", announcementSchema);
