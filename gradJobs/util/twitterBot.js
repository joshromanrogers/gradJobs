var Twitter = require('twitter');
const config = require('../config')[process.env.NODE_ENV];

var client = new Twitter({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token_key: config.access_token_key,
	access_token_secret: config.access_token_secret
});

module.exports = function twitterBot() {
    console.log('doing it');
	let params = {
		status: `I am a tweet ${Math.random()}`
	};

	client.post('statuses/update', params, function (error, tweet, response) {
		if (error) {
			console.log(error);
		}
	});
    
};