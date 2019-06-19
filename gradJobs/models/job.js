const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Parser = require("rss-parser");
var request = require("request");
require("mongoose-moment")(mongoose);
// to get rid of deprecation warning
mongoose.set("useCreateIndex", true);

// DEFINE THE JOB SCHEMA
const jobSchema = new Schema({
	title: { type: String, required: true },
	url: { 
		type: String,
		unique: true,
		index: true,
		required: true },
	categories: { type: Array, required: false},
	description: { type: String, required: false },
	created: { type: String, required: true},
}, {
	timestamps: true
});

// amount of seconds in 60 days
// jobSchema.index({createdAt: 1},{expireAfterSeconds: 5184000});

// takes 2 arguments:
// 1. name of the model as you use it internally

// GET API INFO FROM ADZUNA
// let query = {'app_id': 'bf713980',
//          'app_key': '4d5464baa4f5a7acfe792c7185752567',
//          'content-type': 'application/json',
//          'results_per_page': '50',
//          'what': 'entry level'}
// request.get("http://api.adzuna.com/v1/api/jobs/gb/search/1", {query},
//  (err, res, body) => {
//     console.log(body);
// });


module.exports = mongoose.model("Jobs", jobSchema);