const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const jobs = require("./Jobs");
const fs = require("fs");
const morgan = require("morgan");

// require the mongodb package and you get the MongoClient object from it.
// var mongoClient = require("mongodb").MongoClient;

// INIT THE APP
const app = express(); 

app.use(morgan('dev'));

// middleware that forwards /jobs requests to api/routes/jobs file
app.use("/jobs", require("./api/routes/jobs"));

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


// create url to mongoDB server
// const url = "mongodb://localhost:5000";


mongoose.connect("mongodb+srv://romanrogers:" + encodeURIComponent(process.env.MONGO_ATLAS_PW) + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
	useNewUrlParser: true
});

// console.log(encodeURIComponent(process.env.MONGO_ATLAS_PW));

// TAKE DATA FROM REEDJOBS.JSON AND PLACE INTO ARRAY REEDJOBS
let reedJobsData = fs.readFileSync('reedJobs.json');  
let reedJobs = JSON.parse(reedJobsData);  
// console.log(reedJobs);




// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));


// var url = "mongodb://localhost:5000";

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = {
//         name: "Company Inc",
//         address: "Highway 37"
//     };
//     dbo.collection("customers").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));