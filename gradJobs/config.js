module.exports = {

	production: {
		dbConnection: "mongodb://romanrogers:roman123@ds241647.mlab.com:41647/heroku_b473prv8",
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
		consumer_key: "eWaGNrzMkLB5D10PLT1XxG1yj",
		consumer_secret: "LXzt8vgAyagZmq7PIQCBWcMUFdGCdBnLMTPdHWeWQ3BDr2fbie",
		access_token_key: "3384647993-CbuTwioqzzlMoGI6tOujSMUXePGqqogwBTq7TpF",
		access_token_secret: "HILPgzEdxUeoovA8f9bfY39Sn6QzwNtl7t9qVVWBGaIKr"
	},

	development: {
		dbConnection: "mongodb+srv://romanr:pass4db@cluster0-xcfmt.mongodb.net/test?retryWrites=true&w=majority",
		STRIPE_SECRET_KEY: "sk_test_2v6OueuLFq5aIpKOdIMz86fy",
		STRIPE_PUBLIC_KEY: "pk_test_yzREq7vktDRVBcgUTVLqu5k7"
	},
    
};
