const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-moment")(mongoose);
// to get rid of deprecation warning
mongoose.set("useCreateIndex", true);

// DEFINE THE JOB SCHEMA
const jobSchema = new Schema({
	title: { type: String, required: true },
	company: {type: String, required: false },
	url: { 
		type: String,
		unique: true,
		index: true,
		required: true },
	categories: { type: Array, required: false},
	description: { type: String, required: false },
	created: { type: String, required: true},
	createdAt: { type: Date, default: Date.now, expires: '86400m' },
	status: {type: String, required: true, default: 'scraped'} // 'scraped' 'not_confirmed' 'confirmed
}, {
	timestamps: true
});

// amount of seconds in 60 days
// jobSchema.index({createdAt: 1},{expireAfterSeconds: 5184000});

module.exports = mongoose.model("Jobs", jobSchema);