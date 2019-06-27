var Twitter = require('twitter');
const config = require('../config')[process.env.NODE_ENV];

var client = new Twitter({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token_key: config.access_token_key,
	access_token_secret: config.access_token_secret
});



module.exports = function twitterBot(job) {

	let params = {
		status: `Company are looking for a ${job.title} #${job.categories[0]} #graduatejobs #londongraduates 🎓😍
		${job.link}`
	};

	client.post('statuses/update', {status: params.status}, function (error, tweet, response) {
		if (error) {
			console.log(error);
		}
	});
    
};