const express = require("express");
const morgan = require("morgan");
var mongoose = require("mongoose");
const app = express();

mongoose.connect(
	"mongodb://root:rootuser1@ds263571.mlab.com:63571/amazon-clone",
	err => {
		if (err) {
			console.log("Error connecting with database");
		} else {
			console.log("Connected to database");
		}
	}
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.send("Hello user");
});

app.listen(4000, err => {
	if (err) {
		console.log("Error on server starup ", err);
	}
	console.log("server started on port 4000");
});
