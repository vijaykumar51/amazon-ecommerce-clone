const express = require("express");
const morgan = require("morgan");
const app = express();

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
