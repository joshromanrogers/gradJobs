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
		.exec()
		.then(docs => {
			console.log(docs);
			res.status(200).json(docs);
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
	// get specific id from request
	const id = req.params.id;
	Job.findById(id)
		.exec()
		// if it works, print the doc, respond w/ a 200 status + the documentation as JSON
		.then(doc => {
			console.log("From database:", doc);
			if (doc) {
				res.status(200).json(doc);
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
	newJob.
	save()
		// if a new job is created, log + respond with 201 status + JSON message
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Handling POST request to /jobs",
				createdJob: newJob
			});
		})
		// if job creation fails...
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});


});

// UPDATE A JOB
router.patch('/:id', (req, res, next) => {
	res.status(200).json({
		message: 'Updated product!'
	});
});

// DELETE A JOB
router.delete("/:id", (req, res, next) => {
	const id = req.params.id;
	Job.remove({
			_id: id
		})
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		})
});

module.exports = router;