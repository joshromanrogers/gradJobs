module.exports = {

	production: {
		dbConnection: "mongodb://romanrogers:roman123@ds241647.mlab.com:41647/heroku_b473prv8",
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
	},

	development: {
		dbConnection: "mongodb+srv://romanr:pass4db@cluster0-xcfmt.mongodb.net/test?retryWrites=true&w=majority",
		STRIPE_SECRET_KEY: "sk_test_2v6OueuLFq5aIpKOdIMz86fy",
		STRIPE_PUBLIC_KEY: "pk_test_yzREq7vktDRVBcgUTVLqu5k7"
	},
    
};