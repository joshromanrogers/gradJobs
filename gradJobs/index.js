const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const SOCall = require("./models/SOCall");
const ReedCall = require("./models/ReedCall");
const bodyParser = require("body-parser");
var cron = require('node-cron');
const config = require('./config')[process.env.NODE_ENV];
const twitterBot = require("./util/twitterBot");

// INIT THE APP
const app = express();

// CONNECT TO MONGODB W/ MONGOOSE
mongoose.connect(config.dbConnection, {
	useNewUrlParser: true
});

// STRIPE

const stripeSecretKey = config.STRIPE_SECRET_KEY;
const stripePublicKey = config.STRIPE_PUBLIC_KEY;

const stripe = require('stripe')('sk_test_2v6OueuLFq5aIpKOdIMz86fy');

// TWITTER BOT
// figure out a way of running the client.post when a new job is added to the database.

let testerJob = {
	title: "Front End Developer",
	categories: ["java", "javascript"],
	company: "Apple",
	url: "https://stackoverflow.com/jobs/193045/qa-engineer-test-analyst-medical-management-systems"
};

// FUNCTIONS THAT COMPLETE API + RSS CALLS
// SCHEDULE TASKS WITH NODE-CRON
// */30 * * * *
cron.schedule('* * * * *', () => {
	console.log('======= cron running');
	// Check StackOverflow RSS for new jobs
	SOCall()
		.catch(e => {
			console.log(e);
			return e;
		});
	// Check Reed API for new jobs
	ReedCall()
		.catch(e => {
			console.log(e);
			return e;
		});
	// // Run the Twitter Bot
	// twitterBot(testerJob);
});

// SPECIFY VIEW ENGINE + RENDER TO THE USER
app.set("view engine", "ejs");

// SET STATIC FOLDER, SERVERS STATIC FILES FROM PUBLIC FOLDER TO USER (EG. INDEX.HTML)
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(morgan("dev"));
app.use(express.json());

// middleware that places messages in header to clear CORS errors
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	// so other routes can take over when it's done implementing headers
	next();
});


app.use(bodyParser.urlencoded({
	extended: true
}));

// middleware that forwards /jobs requests to api/routes/jobs file
app.use("/", require("./api/routes/jobs"));

// if the request doesn't fit the above (./api/routes/jobs), below code will take care of error
app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

// function that takes parsed JSON + writes it to specified path
const storeData = (data, path) => {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (err) {
		console.error(err);
	}
};

let port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server started on port ${port}`));