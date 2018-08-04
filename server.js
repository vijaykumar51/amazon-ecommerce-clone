const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
//TODO: read about connect-mongo
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

const secret = require("./config/secret");

const app = express();

mongoose.connect(
	secret.database,
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
// TODO: read more about cookie, session and flash
app.use(cookieParser());
app.use(
	session({
		secret: secret.secretKey,
		// name: "sessionId",
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ url: secret.database, autoReconnect: true })
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

var mainRoutes = require("./routes/main.js");
var userRoutes = require("./routes/user.js");

app.use(mainRoutes);
app.use(userRoutes);

app.listen(secret.port, err => {
	if (err) {
		console.log("Error on server starup ", err);
	}
	console.log(`server started on port ${secret.port}`);
});
