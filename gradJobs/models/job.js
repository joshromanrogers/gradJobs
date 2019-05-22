const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SCHEMA IS LAYOUT OF MODEL OBJECT
const jobSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: { type: String, required: true },
	date: { type: String, required: true },
	url: { type: String, required: true },
	categories: { type: Array, required: false}
});

// takes 2 arguments:
// 1. name of the model as you use it internally
module.exports = mongoose.model("Jobs", jobSchema);