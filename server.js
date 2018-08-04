const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

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

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
// TODO: read about body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

var mainRoutes = require("./routes/main.js");
var userRoutes = require("./routes/user.js");

app.use(mainRoutes);
app.use(userRoutes);

app.listen(4000, err => {
	if (err) {
		console.log("Error on server starup ", err);
	}
	console.log("server started on port 4000");
});
