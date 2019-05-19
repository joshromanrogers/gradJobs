const express = require("express");
const router = express.Router();
// local db of jobs
const jobs = require("../../Jobs");
// schema of what a job must look like
const Job = require("../../models/job");
// connecting to db
// const mongoose = require("mongoose");


// GET ALL JOBS
router.get("/", (req, res) => res.json(jobs));

// GET SINGLE JOB 
router.get("/:id", (req, res) => {
	const found = jobs.some(job => job.id === parseInt(req.params.id));

	if (found) {
		res.json(jobs.filter(job => job.id === parseInt(req.params.id)));
	} else {
		res.status(400).json({
			msg: `No job with the id of ${req.params.id}`
		});
	}
});

router.post("/", (req, res, next) => {

	const newJob = new Job({

		title: req.body.title,
		_id: new mongoose.Types.ObjectId(),
		description: req.body.description,
		isAvailable: req.body.isAvailable

	});

	newJob.save().then(result => {
		console.log(result);
	})
		.catch(err => console.log(err));

	res.status(201).json({
		message: "Handling POST request to /jobs",
		createdJOB: job
	});
});

module.exports = router;