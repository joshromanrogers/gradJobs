const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const morgan = require("morgan");
const Job = require("./models/job");
let Parser = require('rss-parser');
var Moment = require('moment');

// INIT THE APP
const app = express();

// CONNECT TO MONGODB W/ MONGOOSE
mongoose.connect("mongodb+srv://romanrogers:" + encodeURIComponent(process.env.MONGO_ATLAS_PW) + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
	useNewUrlParser: true
});

// 1. GET DATA FROM REED API
// 2. CREATE CATEGORIES PROPERTY + ADD TECH TO EACH DOCUMENT
// 3. COMPILE MODEL FROM SCHEMA FOR EACH DOCUMENT
// 4. INSERT ARRAY OF JOBS TO DATABASE
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
	// if(info.results[0].jobTitle.toLowerCase().includes("engineer")) {
	// }
	
	info.results.forEach(job => {	
		job.categories = 'tech';
	});

	let time = Date.now();
	let timeNotChanging = time;

	const handleError = function() {
		console.error(err);
		// handle your error
	};

	info.results.map(job => {

		job = new Job ({
			title: job.jobTitle,
			url: job.jobUrl,
			categories: job.categories,
			created: new Moment(job.created).fromNow(),
		});
		
		importantInfo.push(job);
	});

	Job.insertMany(importantInfo, function(err) {
		console.log(err);
	});

});

// 1. GET DATA FROM STACK OVERFLOW RSS
// 2. ADD TECH TO THE CATEGORIES ARRAY OF EACH DOCUMENT
// 3. COMPILE MODEL FROM SCHEMA FOR EACH DOCUMENT
// 4. INSERT ARRAY OF JOBS TO DATABASE

let parser = new Parser();

(async () => {

	let feed = await parser.parseURL('https://stackoverflow.com/jobs/feed?location=london&q=graduate');

	var importantSOInfo = [];
	feed.items.forEach(job => {	
		job.categories.push('tech');
	});

	let time = Date.now();
	let timeNotChanging = time;

	const handleError = function() {
		console.error(err);
		// handle your error
	};

	feed.items.map(job => {

		job = new Job ({
			title: job.title,
			url: job.link,
			categories: job.categories,
			created: new Moment(job.created).fromNow(),
		});

		importantSOInfo.push(job);
	});

	Job.insertMany(importantSOInfo, function(err) {
		console.log(err);
	});

})();

// SPECIFY VIEW ENGINE + RENDER TO THE USER
app.set("view engine", "ejs");

// WHEN USER GOES TO HOME PAGE:
// 1. 'FIND' ALL DOCUMENTS OF THE JOBS COLLECTION
// 2. SORT BY DATE
// 3. PUSH TO ARRAY + SEND AS DATA VALUE TO INDEX.EJS TO BE DISPLAYED  :)

app.get('/', (req, res) => {
	// if user is using search bar, reg expression the query
	// run a search for term with mongoose find function
	// if no error, pass data to index.ejs + render :D
	if (req.query.search) {
		const regex = new RegExp(escapeRegExp(req.query.search));
		Job.find({$or:[{title: regex}, {categories: regex}]}, function(err, allJobs) {
			if(err) {
				console.log(err);
			} else {
				res.render('index', {
					data: allJobs,
					moment: Moment
				});
				return;
			}
		});
	} else {
	Job.find({}, null, {
		sort: {
			date: 1
		}
	}, (err, jobs) => {
		if (err) {
			console.log(err);
		} else {
			resultArray.push(jobs);
			res.render('index', {
				data: resultArray[0],
				moment: Moment
			});
		}
	}
	);
};

})

// RETURNS ALL JOBS WITH 'TECH' CATEGORY
app.get('/tech', (req, res) => {
	Job.find({ categories: "tech"}, null, {
		sort: {
			date: 1
		}
	}, (err, jobs) => {
		if (err) {
			console.log(err);
		} else {
			resultArray = [];
			resultArray.push(jobs);
			res.render('index', {
				data: resultArray[0],
				moment: Moment
			});
		}
	});
})

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

// middleware that forwards /jobs requests to api/routes/jobs file
// app.use("/jobs", require("./api/routes/jobs"));

// if the request doesn't fit the above (/jobs), below code will take care of error
// app.use((req, res, next) => {
// 	const error = new Error("Not Found");
// 	error.status = 404;
// 	next(error);
// });

// app.use((error, req, res, next) => {
// 	res.status(error.status || 500);
// 	res.json({
// 		error: {
// 			message: error.message
// 		}
// 	});
// });

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
let resultArray = [];

// findAllJobs();
// let jobID = '5ce3d6c499b1d9041aed7378';
// findJob(jobID);

// console.log(document.getElementsByClassName('tech'));

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }


const PORT = process.env.PORT || 2000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


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