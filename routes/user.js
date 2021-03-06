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
	user.profile.picture = user.gravatar();

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
				if (err) return next(err);

				req.logIn(user, function(err) {
					if (err) return next(err);
					res.redirect("/profile");
				});
			});
		}
	});
});

router.get("/edit-profile", (req, res, next) => {
	res.render("accounts/edit-profile.ejs", { message: req.flash("success") });
});

router.post("/edit-profile", (req, res, next) => {
	User.findOne({ _id: req.user._id }, function(err, user) {
		if (err) return next(err);

		if (req.body.name) user.profile.name = req.body.name;
		if (req.body.address) user.profile.address = req.body.address;

		user.save(err => {
			if (err) return next(err);
			req.flash("success", "Profile changes saved successfully");
			res.redirect("/edit-profile");
		});
	});
});

router.get("/logout", (req, res, next) => {
	req.logOut();
	res.redirect("/");
});

module.exports = router;
