const express = require("express");
const router = express.Router();
// local db of jobs
const jobs = require("../../Jobs");
// schema of what a job must look like
const Job = require("../../models/job");
// connecting to db
const mongoose = require("mongoose");

// 1. (GET) GET ALL JOBS
// 2. (GET) GET A SINGLE JOB
// 3. (POST) CREATE A NEW JOB
// 4. (PATCH) UPDATE A JOB
// 5. (DELETE) DELETE A JOB

// GET ALL JOBS
router.get("/", (req, res, next) => {
	Job.find()
		// only returns the values that are selected
		.select('_id title date url')
		.exec()
		.then(docs => {
			// providing a structured response when GETing which includes what to do to
			// get more information about this
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return {
						_id: doc._id,
						title: doc.title,
						date: doc.date,
						url: doc.url,

						request: {
							type: 'GET',
							url: 'http://localhost:2000/jobs/' + doc._id
						}
					}
				})
			};
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// GET SINGLE JOB 
// (colon makes it a dynamic id )
router.get("/:id", (req, res, next) => {
	// extract id from request
	const id = req.params.id;
	Job.findById(id)
		// only returns the values that are selected
		.select('_id title date url')
		.exec()
		// if it works, print the doc, respond w/ a 200 status + the documentation as JSON
		.then(doc => {
			console.log("From database:", doc);
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: 'GET',
						url: 'http://localhost:2000/jobs/' + doc._id					}
				});
			} else {
				res.status(404).json({
					message: "no valid data found for provided ID"
				});
			}
		})
		.catch(err => {
			// if it doesn't work, print the error + respond w/ a 500 status + a JSON formatted error
			console.log(err);
			res.status(500).json({
				error: err
			});
		});

});

// CREATE A NEW JOB
router.post("/", (req, res, next) => {

	// create new job using the Job model that's imported from models.js
	const newJob = new Job({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		date: req.body.date,
		url: req.body.url
	});

	// save is provided mongoose which can be used on mongoose models,
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
						type: 'POST',
						url: 'http://localhost:2000/jobs/' + result._id
					}
				}
			});
		})
		// if job creation fails...
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});


});

// UPDATE A JOB
router.patch("/:id", (req, res, next) => {
	const id = req.params.id;
	const props = req.body;
	Job.updateOne({
			_id: id
		}, props)
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Job updated',
				request: {
					type: 'GET',
					url: 'http://localhost:2000/jobs' + id
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// DELETE A JOB
router.delete("/:id", (req, res, next) => {
	// extract id from request
	const id = req.params.id;
	Job.remove({
			_id: id
		})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted',
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;