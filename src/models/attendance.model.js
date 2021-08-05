const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
	// author of the attendance
	author: mongoose.SchemaTypes.ObjectId,

	// purpose of the attendance
	purpose: {
		type: String,
		default: "daily attendance",
	},

	// list of absent students
	// contains array of _id of user absent
	absentList: {
		type: [mongoose.SchemaTypes.ObjectId],
		default: [],
		required: [true, "absent list is required"],
	},

	// contains number of students absent
	absentCount: Number,

	// date of attendance
	date: {
		type: Date,
		required: [true, "date of attendance is required"],
	},
});

mongoose.model("Attendance", attendanceSchema);
