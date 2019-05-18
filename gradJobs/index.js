const express = require("express");
var request = require("request");
const path = require("path");
const mongoose = require("mongoose");
const members = require("./Members");

const app = express();


// mongoose.connect("mongodb+srv://romanrogers:" + process.env.MONGO_ATLAS_PW + "@cluster0-xcfmt.mongodb.net/test?retryWrites=true", {
// 	useNewUrlParser: true
// });

app.use("/api/members", require("./routes/api/members"));


// SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

// GET API INFO FROM REED
request.get(" https://www.reed.co.uk/api/1.0/search?keywords=graduate", {
	"auth": {
		"user": "417100be-8a8c-46f8-8663-ef89647a035e",
		"pass": "",
	}
}, (err, res, body) => {
	var info = JSON.parse(body);
	var results = info.results;
	results.forEach(result => {
		// console.log(result.jobId);
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));