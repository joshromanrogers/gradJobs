const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-moment')(mongoose);
// to get rid of deprecation warning
mongoose.set('useCreateIndex', true);

// DEFINE THE JOB SCHEMA
const jobSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: { type: String, required: true },
	url: { 
		type: String,
		unique: true,
		index: true,
		required: true },
	categories: { type: Array, required: false},
	created: { type: String, required: true},
}, {
	timestamps: true
});

// amount of seconds in 60 days
// jobSchema.index({createdAt: 1},{expireAfterSeconds: 5184000});

// takes 2 arguments:
// 1. name of the model as you use it internally
module.exports = mongoose.model("Jobs", jobSchema);