

const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const Job = require("./models/job");
const SOCall = require("./models/SOCall");
const ReedCall = require("./models/ReedCall");
const bodyParser = require("body-parser");
var cron = require('node-cron');

// INIT THE APP
const app = express();

// console.log(encodeURIComponent(process.env.MONGO_ATLAS_PW));

// check to see if we are working in development of production environment
if (process.env.NODE_ENV === 'development') {
	// if we are in development, load env file
	require('dotenv').config();
	// Define the development db
	dbName = 'database1';
	// CONNECT TO MONGODB W/ MONGOOSE
mongoose.connect(process.env.MONGO_ATLAS_URL, {
	useNewUrlParser: true
});
} else if (process.env.NODE_ENV === 'production') {
	// Define the production db
	dbName = 'database2';
}


// STRIPE

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
//console.log(stripeSecretKey, stripePublicKey);

const stripe = require('stripe')('sk_test_2v6OueuLFq5aIpKOdIMz86fy');

// (async () => {
//   const charge = await stripe.charges.create({
//     amount: 999,
//     currency: 'usd',
//     source: 'tok_visa',
//     receipt_email: 'jenny.rosen@example.com',
//   });
// })();

// app.use(flash());
console.log('start');


// FUNCTIONS THAT COMPLETE API + RSS CALLS
// SCHEDULE TASKS WITH NODE-CRON

cron.schedule('* * * * *', () => {
	console.log('======= cron running')
	SOCall()
		.catch(e => {
			return e
		});
	ReedCall()
		.catch(e => {
			return e
		})

});

// setInterval(() => SOCall()
// 	.catch(e => {
// 		return e
// 	}), 1800000);

// setInterval(() => ReedCall()
// 	.catch(e => {
// 		return e
// 	}), 1800000);


// SPECIFY VIEW ENGINE + RENDER TO THE USER
app.set("view engine", "ejs");

// SET STATIC FOLDER, SERVERS STATIC FILES FROM PUBLIC FOLDER TO USER (EG. INDEX.HTML)
app.use(express.static(path.join(__dirname, "public")));

//
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

// if the request doesn't fit the above (/jobs), below code will take care of error
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

async function deleteAllJobs() {
	try {
		await Job.deleteMany({});
		console.log('Done!');
		// process.exit();
	} catch (e) {
		console.log(e);
		process.exit();
	}
}

// deleteAllJobs();

// UPLOAD JOBS JSON TO MONGODB USING THE JOBS MODEL (GIVING THEM ID'S)
async function loadJobs(jobs) {
	try {
		await Job.insertMany(jobs);
		console.log('Done!');
	} catch (e) {
		console.log(e);
		process.exit();
	}
}

// FIND JOBS IN MONGODB USING THE JOBS MODEL 
async function findJob(id) {
	try {
		await Job.findById(id, (err, job) => {
			if (err) {
				console.log(err);
			} else {
				console.log(job);
			}
		});
		console.log('Done!');
		// process.exit();
	} catch (e) {
		console.log(e);
		process.exit();
	}
}

// let jsdom = require('jsdom').JSDOM,

// 	// the file I will be loading
// 	uri = 'views/index.ejs',

// 	// the options that I will be giving to jsdom
// 	options = {
// 		runScripts: 'dangerously',
// 		resources: "usable"
// 	};

let port = process.env.PORT || 2000;

app.listen(port, () => console.log(`Server started on port ${port}`));