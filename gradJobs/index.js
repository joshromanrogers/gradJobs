const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const jobs = require("./Jobs");
const fs = require("fs");

// require the mongodb package and you get the MongoClient object from it.
// var mongoClient = require("mongodb").MongoClient;

// INIT THE APP
const app = express();

// GET API INFO FROM REED
request.get(" https://www.reed.co.uk/api/1.0/search?keywords=graduate", {
	"auth": {
		"user": "417100be-8a8c-46f8-8663-ef89647a035e",
		"pass": "",
	}
}, (err, res, body) => {
	// parse JSON + store in file called 'reedJobs'
    var info = JSON.parse(body);
    var importantInfo = [];
    info.results.map( job => {
        job = {
            title: job.jobTitle,
            location: job.locationName,
            date: job.date,
            url: job.jobUrl
        }
        importantInfo.push(job);
    });

    
	storeData( importantInfo, "./reedJobs");
    
});

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


// mongoose.connect("mongodb+srv://romanrogers:" + process.env.MONGO_ATLAS_PW + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
// 	useNewUrlParser: true
// });

app.use("/api/members", require("./routes/api/jobs"));


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