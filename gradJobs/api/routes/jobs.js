// check to see if we are working in development of production environment
if(process.env.NODE_ENV !== 'production') {
	// if we are in development, load env file
	require('dotenv').config();
}

const express = require("express");
const router = express.Router();
const fs = require("fs");
// schema of what a job must look like
const Job = require("../../models/job");
// connecting to db
const mongoose = require("mongoose");
var Moment = require("moment");
const reg = require("../../util/regex");
const bodyParser = require("body-parser");


const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// WHEN USER GOES TO HOME PAGE:
// 1. 'FIND' ALL DOCUMENTS OF THE JOBS COLLECTION
// 2. SORT BY DATE
// 3. PUSH TO ARRAY + SEND AS DATA VALUE TO INDEX.EJS TO BE DISPLAYED  :)
let resultArray = [];
router.get("/", (req, res) => {
	// if user is using search bar, reg expression the query
	// run a search for term with mongoose find function
	// if no error, pass data to index.ejs + render :D
	if (req.query.search) {
		const regex = new RegExp(reg.escapeRegExp(req.query.search));
		Job.find({
		}, function (err, allJobs) {
			if (err) {
				console.log(err);
			} else {
				res.render("index", {
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
				res.render("index", {
					data: resultArray[0],
					moment: Moment
				});
			}
		});
	}

});


// CREATE A NEW JOB
router.post("/postJob", (req, res, next) => {
		// create new job using the Job model that's imported from models.js
	const newJob = new Job({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		url: req.body.url,
		categories: req.body.categories,
		created: new Moment().fromNow(),
	});

	// save is provided by mongoose which can be used on mongoose models,
	// will store in the DB
	newJob
		.save()
		// if a new job is created, log + respond with 201 status + JSON message
		// and a structured response of info about the job
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Handling POST request to /jobs",
				createdJob: {
					_id: result._id,
					title: result.title,
					date: result.date,
					url: result.url,

					request: {
						type: "POST",
						url: "http://localhost:2000/jobs/" + result._id
					}
				}
			});
		})
		// if job creation fails...
		.catch(err => {
			console.log(err);
			console.log('failed');
			res.status(500).json({
				error: err
			});
		});


});

// WEBHOOK ENDPOINT
// Match the raw body to content type application/json
router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
	let event;
  
	try {
	  event = JSON.parse(request.body);
	}
	catch (err) {
	  response.status(400).send(`Webhook Error: ${err.message}`);
	}
  
	// Handle the event
	switch (event.type) {
	  case 'payment_intent.succeeded':
		const paymentIntent = event.data.object;
		handlePaymentIntentSucceeded(paymentIntent);
		break;
	  case 'payment_method.attached':
		const paymentMethod = event.data.object;
		handlePaymentMethodAttached(paymentMethod);
		break;
	  // ... handle other event types
	  default:
		// Unexpected event type
		return response.status(400).end();
	}
  
	// Return a response to acknowledge receipt of the event
	response.json({received: true});
  });

router.get("/postJob", (req, res) => {
	fs.readFile("items.json", function(error, data) {
		if (error) {
			res.status(500).end();
		} else {
			// render the postJob page and pass + parse the JSON data
			res.render("postJob", {
				stripePublicKey: stripePublicKey,
				items: JSON.parse(data)
			})
		}
	})
})


// RETURNS ALL JOBS WITH 'TECH' CATEGORY
// data in resultArray[0] is apssed to index.ejs
router.get("/tech", (req, res) => {
	Job.find({
		categories: "tech"
	}, null, {
		sort: {
			date: 1
		}
	}, (err, jobs) => {
		if (err) {
			console.log(err);
		} else {
			resultArray = [];
			resultArray.push(jobs);
			res.render("index", {
				data: resultArray[0],
				moment: Moment
			});
		}
	});
});

// GET ALL JOBS
// router.get("/", (req, res, next) => {
// 	Job.find()
// 		// only returns the values that are selected
// 		.select("_id title date url")
// 		.exec()
// 		.then(docs => {
// 			// providing a structured response when GETing which includes what to do to
// 			// get more information about this
// 			const response = {
// 				count: docs.length,
// 				products: docs.map(doc => {
// 					return {
// 						_id: doc._id,
// 						title: doc.title,
// 						date: doc.date,
// 						url: doc.url,

// 						request: {
// 							type: "GET",
// 							url: "http://localhost:2000/jobs/" + doc._id
// 						}
// 					};
// 				})
// 			};
// 			res.status(200).json(response);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// });

// GET SINGLE JOB 
// (colon makes it a dynamic id )
// router.get("/:id", (req, res, next) => {
// 	// extract id from request
// 	const id = req.params.id;
// 	Job.findById(id)
// 		// only returns the values that are selected
// 		.select("_id title date url")
// 		.exec()
// 		// if it works, print the doc, respond w/ a 200 status + the documentation as JSON
// 		.then(doc => {
// 			console.log("From database:", doc);
// 			if (doc) {
// 				res.status(200).json({
// 					product: doc,
// 					request: {
// 						type: "GET",
// 						url: "http://localhost:2000/jobs/" + doc._id					}
// 				});
// 			} else {
// 				res.status(404).json({
// 					message: "no valid data found for provided ID"
// 				});
// 			}
// 		})
// 		.catch(err => {
// 			// if it doesn't work, print the error + respond w/ a 500 status + a JSON formatted error
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});

// });

// CREATE A NEW JOB
// router.post("/", (req, res, next) => {

// 	// create new job using the Job model that's imported from models.js
// 	const newJob = new Job({
// 		_id: new mongoose.Types.ObjectId(),
// 		title: req.body.title,
// 		date: req.body.date,
// 		url: req.body.url
// 	});

// 	// save is provided by mongoose which can be used on mongoose models,
// 	// will store in the DB
// 	newJob
// 		.save()
// 		// if a new job is created, log + respond with 201 status + JSON message
// 		// and a structured response of info about the job
// 		.then(result => {
// 			console.log(result);
// 			res.status(201).json({
// 				message: "Handling POST request to /jobs",
// 				createdJob: {
// 					_id: result._id,
// 					title: result.title,
// 					date: result.date,
// 					url: result.url,

// 					request: {
// 						type: "POST",
// 						url: "http://localhost:2000/jobs/" + result._id
// 					}
// 				}
// 			});
// 		})
// 		// if job creation fails...
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});


// });

// UPDATE A JOB
// router.patch("/:id", (req, res, next) => {
// 	const id = req.params.id;
// 	const props = req.body;
// 	Job.updateOne({
// 		_id: id
// 	}, props)
// 		.exec()
// 		.then(result => {
// 			res.status(200).json({
// 				message: "Job updated",
// 				request: {
// 					type: "GET",
// 					url: "http://localhost:2000/jobs" + id
// 				}
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// });

// DELETE A JOB
// router.delete("/:id", (req, res, next) => {
// 	// extract id from request
// 	const id = req.params.id;
// 	Job.remove({
// 		_id: id
// 	})
// 		.exec()
// 		.then(result => {
// 			res.status(200).json({
// 				message: "Product deleted",
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// });

module.exports = router;