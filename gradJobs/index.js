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
// var flash = require('express-flash-messages')

// INIT THE APP
const app = express();

// CONNECT TO MONGODB W/ MONGOOSE
mongoose.connect("mongodb+srv://romanrogers:" + encodeURIComponent(process.env.MONGO_ATLAS_PW) + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
	useNewUrlParser: true
});

// app.use(flash());

// FUNCTIONS THAT COMPLETE API + RSS CALLS
setInterval(() => SOCall()
	.catch(e => {
		return e
	}), 10000);

setInterval(() => ReedCall()
	.catch(e => {
		return e
	}), 10000);


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
app.use("/jobs", require("./api/routes/jobs"));

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

let jsdom = require('jsdom').JSDOM,

	// the file I will be loading
	uri = 'views/index.ejs',

	// the options that I will be giving to jsdom
	options = {
		runScripts: 'dangerously',
		resources: "usable"
	};

// load from an external file
jsdom.fromFile(uri, options).then(function (dom) {

	let window = dom.window;
	let document = window.document;

	let header = document.getElementsByTagName('H1');
	console.log(header);
	header.style.color = "red";

	let title = document.querySelectorAll('TH');
	// title[0].style.backgroundColor = "red";
	for (i = 0; i < title.length; i++) {
		title[i].style.backgroundColor = "red";
	}
}).catch(function (e) {

	console.log(e);

});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));