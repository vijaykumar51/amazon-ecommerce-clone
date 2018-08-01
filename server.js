const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

var User = require("./models/user");

const app = express();

mongoose.connect(
	"mongodb://root:rootuser1@ds263571.mlab.com:63571/amazon-clone",
	{
		useNewUrlParser: true
	},
	err => {
		if (err) {
			console.log("Error connecting with database");
		} else {
			console.log("Connected to database");
		}
	}
);

app.use(morgan("dev"));
// TODO: read about body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello user");
});

app.post("/create-user", (req, res, next) => {
	var user = new User();

	user.email = req.body.email;
	user.password = req.body.password;
	user.profile.name = req.body.name;

	user.save(err => {
		if (err) {
			console.log(err);
			res.status(502).json("Error creating user");
		} else {
			res.status(200).json("User successfully created");
		}
	});
});

app.listen(4000, err => {
	if (err) {
		console.log("Error on server starup ", err);
	}
	console.log("server started on port 4000");
});
