const express = require('express');
var request = require('request');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

// request.get('https://www.reed.co.uk/api/1.0/search?keywords=accountant', {
//     'auth': {
//         'user': '417100be-8a8c-46f8-8663-ef89647a035e',
//         'pass': ''
//         // 'sendImmediately': false
//     }
// });
 

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