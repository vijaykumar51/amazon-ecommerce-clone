const express = require("express");
const app = express();

app.listen(4000, err => {
	if (err) {
		console.log("Error on server starup ", err);
	}
	console.log("server started on port 4000");
});
