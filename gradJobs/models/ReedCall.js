const fetch = require("node-fetch");
var btoa = require('btoa');
const Job = require("./job");
var Moment = require('moment');

module.exports = async function reedCall() {
    // fetch request data
    let username = "417100be-8a8c-46f8-8663-ef89647a035e";
    let password = "";
    let url = "https://www.reed.co.uk/api/1.0/search?keywords=graduate&location=London";

    // await result of calling fetch request w/ an authentication header
    // and then store results in 'data' variable
    const data = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
        },
    });
    // json() returns a promise that resolves w/ the result of parsing body text as JSON
    const jsonData = await data.json();

    console.log(jsonData.results);

    var importantInfo = [];

    jsonData.results.forEach(job => {
        job.categories = 'tech';
    });

    jsonData.results.map(job => {

        job = new Job({
            title: job.jobTitle,
            url: job.jobUrl,
            categories: job.categories,
            created: new Moment(job.created).fromNow(),
        });

        importantInfo.push(job);
    });

    Job.insertMany(importantInfo, function (err) {
        console.log(err);
    })

};


// var importantInfo = [];

// data.results.forEach(job => {
//     job.categories = 'tech';
// });

// info.results.map(job => {

//     job = new Job({
//         title: job.jobTitle,
//         url: job.jobUrl,
//         categories: job.categories,
//         created: new Moment(job.created).fromNow(),
//     });

//     importantInfo.push(job);
// });

// Job.insertMany(importantInfo, function (err) {
//         console.log(err);
//     })


//     .catch(err => {
//         console.log(err);
//     })
// };

// importantInfo.forEach((job) => {
//     let query = {};
//     let update = {
//         title: job.jobTitle,
//         url: job.jobUrl,
//         categories: job.categories,
//         created: new Moment(job.created).fromNow(),
//     };
//     let options = {
//         upsert: true,
//         new: true,
//         setDefaultsOnInsert: false,
//     };
//     Job.findOneAndUpdate(query, update, options)
//         .then((done) => {
//             console.log('inserted' + done);
//         });
// })

// Job.updateMany(importantInfo, {
//     $setOnInsert: importantInfo
// }, {
//     upsert: true
// });



// // 1. GET DATA FROM REED API
// // 2. CREATE CATEGORIES PROPERTY + ADD TECH TO EACH DOCUMENT
// // 3. COMPILE MODEL FROM SCHEMA FOR EACH DOCUMENT
// // 4. INSERT ARRAY OF JOBS TO DATABASE
// request.get(" https://www.reed.co.uk/api/1.0/search?keywords=graduate&location=London", {
//     "auth": {
//         "user": "417100be-8a8c-46f8-8663-ef89647a035e",
//         "pass": "",
//     }
// }, (err, res, body) => {

//     // parse JSON, for each result, build an object with the relevant info
//     // + store in a file called 'reedJobs'
//     var info = JSON.parse(body);
//     var importantInfo = [];
//     // if(info.results[0].jobTitle.toLowerCase().includes("engineer")) {
//     // }

//     info.results.forEach(job => {
//         job.categories = 'tech';
//     });

//     let time = Date.now();
//     let timeNotChanging = time;

//     const handleError = function () {
//         console.error(err);
//         // handle your error
//     };

//     info.results.map(job => {

//         job = new Job({
//             title: job.jobTitle,
//             url: job.jobUrl,
//             categories: job.categories,
//             created: new Moment(job.created).fromNow(),
//         });

//         importantInfo.push(job);
//     });

//     // Job.insertMany(importantInfo, function (err) {
//     // 	console.log(err);
//     // });

//     importantInfo.forEach((job) => {
//         let query = {};
//         let update = {
//             title: job.jobTitle,
//             url: job.jobUrl,
//             categories: job.categories,
//             created: new Moment(job.created).fromNow(),
//         };
//         let options = {
//             upsert: true,
//             new: true,
//             setDefaultsOnInsert: false,
//         };
//         Job.findOneAndUpdate(query, update, options)
//             .then((done) => {
//                 console.log('inserted' + done);
//             });
//     })

//     // Job.updateMany(importantInfo, {
//     // 	$setOnInsert: importantInfo
//     // }, {
//     // 	upsert: true
//     // });

// });