let Parser = require('rss-parser');
const Job = require("./job");
var Moment = require('moment');

// 1. GET DATA FROM STACK OVERFLOW RSS
// 2. ADD TECH TO THE CATEGORIES ARRAY OF EACH DOCUMENT
// 3. COMPILE MODEL FROM SCHEMA FOR EACH DOCUMENT
// 4. INSERT ARRAY OF JOBS TO DATABASE

let parser = new Parser();

// asynchronous anonymous function
module.exports = async function callSO() {
	// await the result of calling the RSS and turning it into JS objects
	// and then store the results in variable called feed
	let feed = await parser.parseURL('https://stackoverflow.com/jobs/feed?location=london&q=graduate');

	var importantSOInfo = [];
	feed.items.forEach(job => {
		job.categories.push('tech');
	});

	feed.items.map(job => {

		job = new Job({
			title: job.title,
			url: job.link,
			categories: job.categories,
			created: new Moment(job.created).fromNow(),
		});

		importantSOInfo.push(job);
	});

	Job.insertMany(importantSOInfo, function (err) {
		console.log(err);
	});

	//  importantSOInfo.forEach((job) => {
	// 	 console.log(job);
	// 	let query = {};
	// 	let update = {
	// 		title: job.title,
	// 		url: job.url,
	// 		categories: job.categories,
	// 		created: new Moment(job.created).fromNow(),
	// 	};
	// 	let options = {
	// 		upsert: true,
	// 		new: true,
	// 		setDefaultsOnInsert: false,
	// 	};

	// 	Job.findOneAndUpdate(query, update, options)
	// 	.then((done) => {
	// 		console.log('inserted' + done);
	// 	});
	// })

	

	// Job.update({}, importantSOInfo, {upsert: true});

};