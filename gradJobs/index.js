const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const Jobs = require("./models/job");

// INIT THE APP
const app = express(); 

// CONNECT TO MONGODB W/ MONGOOSE
mongoose.connect("mongodb+srv://romanrogers:" + encodeURIComponent(process.env.MONGO_ATLAS_PW) + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
	useNewUrlParser: true
});

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

// middleware that forwards /jobs requests to api/routes/jobs file
app.use("/jobs", require("./api/routes/jobs"));

// if the request doesn't fit the abover (/jobs), below code will take care of error
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

// GET API INFO FROM REED
request.get(" https://www.reed.co.uk/api/1.0/search?keywords=graduate&location=London", {
	"auth": {
		"user": "417100be-8a8c-46f8-8663-ef89647a035e",
		"pass": "",
	}
}, (err, res, body) => {
	// parse JSON, for each result, build an object with the relevant info
	// + store in a file called 'reedJobs'
	var info = JSON.parse(body);
	var importantInfo = [];
	info.results.map( job => {
		job = {
			title: job.jobTitle,
			date: job.date,
			url: job.jobUrl
		};
		importantInfo.push(job);
	});

	storeData( importantInfo, "./reedJobs");

});

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

// function that takes parsed JSON + writes it to specified path
const storeData = (data, path) => {
	try {
		fs.writeFileSync(path, JSON.stringify(data));
	} catch (err) {
		console.error(err);
	}
};

// TAKE DATA FROM REEDJOBS.JSON AND PLACE INTO ARRAY REEDJOBS
let reedJobsData = fs.readFileSync("reedJobs.json");  
let reedJobs = JSON.parse(reedJobsData);  
Jobs.insertMany(reedJobs[0]);

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));