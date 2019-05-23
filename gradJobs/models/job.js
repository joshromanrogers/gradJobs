const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-moment')(mongoose);

// DEFINE THE JOB SCHEMA
const jobSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: { type: String, required: true },
	url: { type: String, required: false },
	categories: { type: Array, required: false},
	created: { type: String, required: true},
}, {
	timestamps: true
});

// takes 2 arguments:
// 1. name of the model as you use it internally
module.exports = mongoose.model("Jobs", jobSchema);