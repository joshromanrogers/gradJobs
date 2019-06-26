const fetch = require("node-fetch");
var btoa = require('btoa');
const Job = require("./job");
var Moment = require('moment');

// 1. GET DATA FROM REED API
// 2. IF WE HAVE A NEW JOB (NO DOCUMENT W/ THAT URL ALREADY IN COLLECTION)
// 2. CREATE CATEGORIES PROPERTY + ADD TECH TO EACH DOCUMENT
// 3. COMPILE MODEL FROM SCHEMA + SAVE FOR EACH DOCUMENT

module.exports = async function reedCall() {
    // fetch request data
    let username = "417100be-8a8c-46f8-8663-ef89647a035e";
    let password = "";
    let url = "https://www.reed.co.uk/api/1.0/search?keywords=graduate&locationName=London";

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

    const jobs = await Job.find();
    const jobUrls = jobs.map((job)=> job.url);
    
    jsonData.results.filter((job)=> !jobUrls.includes(job.jobUrl)).forEach(job => {

        // array of different possible categories
        let categoriesArray = ['javascript', 'recruitment', 'property', 'teaching', 
        'analyst', 'finance', 'sales', 'human resources'];

        // remove the word graduate from titles
        let jobTitle = job.jobTitle.replace('Graduate','');

        // title to lower case and then split words into an array
        let jobTitleWords = jobTitle.toLowerCase().split(" ");
        
        // only keep the words that are in the categories array
        let jobCategories = jobTitleWords.filter( item => {
            return categoriesArray.includes(item);
        })

        job = new Job({
            title: jobTitle,
            url: job.jobUrl,
            categories: jobCategories,
            description: job.jobDescription,
            created: new Moment(job.created).fromNow(),
        });
        job.save();
    });

};
