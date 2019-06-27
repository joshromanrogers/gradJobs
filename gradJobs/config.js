module.exports = {

	production: {
		dbConnection: "mongodb://romanrogers:roman123@ds241647.mlab.com:41647/heroku_b473prv8",
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_SECRET
	},

	development: {
		dbConnection: "mongodb+srv://romanr:pass4db@cluster0-xcfmt.mongodb.net/test?retryWrites=true&w=majority",
		STRIPE_SECRET_KEY: "sk_test_2v6OueuLFq5aIpKOdIMz86fy",
		STRIPE_PUBLIC_KEY: "pk_test_yzREq7vktDRVBcgUTVLqu5k7",
		consumer_key: "3vAkvOLkIo62cfr8BhPXBZKfN",
		consumer_secret: "5f0A6onquixQUGXLgdexkjcFKoeAoeGzRAVw7noVxfm6ZKBLTm",
		access_token_key: "1144217611200344064-m6jkzYGcVKKHBQ10lagbBkKlPqiSLu",
		access_token_secret: "EVg082HoDitUvbBjMR9DNAdpuzt6VuRrAYJz58xCMV9JK"
	},
    
};
