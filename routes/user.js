var router = require("express").Router();
var User = require("../models/user");

router.get("/signup", (req, res) => {
	res.render("accounts/signup", {
		errors: req.flash("errors")
	});
});

router.post("/signup", (req, res, next) => {
	var user = new User();

	user.email = req.body.email;
	user.password = req.body.password;
	user.profile.name = req.body.name;

	User.findOne({ email: user.email }, function(err, userExists) {
		if (err) {
			console.log(err);
			return next(err);
		}

		if (userExists) {
			req.flash("errors", `${user.email} alreay exists`);
			res.redirect("/signup");
		} else {
			user.save(err => {
				if (err) {
					console.log(err);
					return next(err);
				} else {
					res.redirect("/");
				}
			});
		}
	});
});

module.exports = router;
