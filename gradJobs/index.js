const express = require('express');
var request = require('request');
const path = require('path'); 

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

// GET API INFO FROM REED
request.get(' https://www.reed.co.uk/api/1.0/search?keywords=graduate', {
  'auth': {
    'user': '417100be-8a8c-46f8-8663-ef89647a035e',
    'pass': '',
  }
}, (err, res, body) => {
    var info = JSON.parse(body);
    var results = info.results;
    results.forEach(result => {
        console.log(result.jobId);
    })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));