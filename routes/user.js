var router = require("express").Router();
var passport = require("passport");
var User = require("../models/user");
var passportConfig = require("../config/passport");

router.get("/login", (req, res) => {
	if (req.user) {
		res.redirect("/");
	}
	res.render("accounts/login", {
		message: req.flash("loginMessage")
	});
});

router.post(
	"/login",
	passport.authenticate("local-login", {
		successRedirect: "/profile",
		failueRedirect: "/login",
		failureFlash: true
	})
);

router.get("/profile", (req, res, next) => {
	User.findOne({ _id: req.user._id }, (err, user) => {
		if (err) return next(err);
		res.render("accounts/profile", { user: user });
	});
});

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
