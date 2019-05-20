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
router.get("/", (req, res, next) => res.json(jobs));

// GET SINGLE JOB 
// colon makes it a dynamic id 
router.get("/:id", (req, res, next) => {
	const found = jobs.some(job => job.id === parseInt(req.params.id));

	if (found) {
		res.json(jobs.filter(job => job.id === parseInt(req.params.id)));
	} else {
		res.status(400).json({
			msg: `No job with the id of ${req.params.id}`
		});
	}
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
	newJob.save().then(result => {
		console.log(result);
	})
		.catch(err => console.log(err));

	res.status(201).json({
		message: "Handling POST req uest to /jobs",
		createdJob: newJob
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
	res.status(200).json({
		message: 'Deleted product!'
	});
});

module.exports = router;