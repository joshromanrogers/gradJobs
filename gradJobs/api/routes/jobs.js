// check to see if we are working in development of production environment
if(process.env.NODE_ENV !== 'production') {
	// if we are in development, load env file
	require('dotenv').config();
}

const express = require("express");
const router = express.Router();
const fs = require("fs");
const Job = require("../../models/job");
const mongoose = require("mongoose");
var Moment = require("moment");
const bodyParser = require("body-parser");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// WHEN USER GOES TO HOME PAGE:
// 1. 'FIND' ALL DOCUMENTS OF THE JOBS COLLECTION
// 2. SORT BY DATE
// 3. PUSH TO ARRAY + SEND AS DATA VALUE TO INDEX.EJS TO BE DISPLAYED  :)
router.get("/", (req, res) => {
	// if user is using search bar, reg expression the query
	// run a search for term with mongoose find function
	// if no error, pass data to index.ejs + render :D
	if (req.query.search) {
		// const regex = new RegExp(reg.escapeRegExp(req.query.search));
		Job.find({
			categories: req.query.search,
		}, null, {
			sort: {
				createdAt: -1
			}
		}, (err, jobs) => {
			if (err) {
				console.log(err);
			} else {
				res.render("index", {
					data: jobs,
					moment: Moment
				});
				return;
			}
		});
	} else {
		Job.find({}, null, {
			sort: {
				createdAt: -1
			}
		}, (err, jobs) => {
			if (err) {
				console.log(err);
			} else {
				res.render("index", {
					data: jobs,
					moment: Moment
				});
			}
		});
	}
});

// CREATE A NEW JOB
router.post("/finishCheckout", (req, res, next) => {
	const newJob = new Job({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		url: req.body.url,
		categories: req.body.categories,
		created: new Moment().fromNow(),
		status: "not_confirmed"
	});

	newJob.save()
		.then(result => {
			res.render('finishCheckout', {
				_id: result._id,
				stripePublicKey
			});
			/*.status(201).json({
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
			});*/
		})
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

// JOB POSTING PAGE
router.get("/postJob", (req, res) => {
	fs.readFile("items.json", function(error, data) {
		if (error) {
			res.status(500).end();
		} else {
			// render the postJob page and pass + parse the JSON data
			res.render("postJob", {
				stripePublicKey: stripePublicKey,
				items: JSON.parse(data)
			});
		}
	});
});

// DYNAMICALLY RETURNS ALL JOBS W/ A CATEGORY THAT IS EQUAL TO THE PARAM NAME
router.get("/:name", (req, res) => {
	let cat = req.params.name;

	Job.find({
		categories: cat
	}, null, {
		sort: {
			createdAt: -1
		}
	}, (err, jobs) => {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				data: jobs,
				moment: Moment
			});
		}
	});
});

module.exports = router;