const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String,

	profile: {
		name: { type: String, default: "" },
		picture: { type: String, default: "" },
		address: String
	},

	history: [
		{
			date: Date,
			paid: { type: Number, default: 0 }
		}
	]
});

// TODO: read more about pre
UserSchema.pre("save", function(next) {
	var user = this;
	if (!user.isModified("password")) return next();
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.gravatar = function(size) {
	if (!this.size) size = 200;
	if (!this.email) return `https://gravatar.com/avatar/?s${size}&d=retro`;
	var md5 = crypto
		.createHash("md5")
		.update(this.email)
		.digest("hex");

	var gravatarUrl = `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
	console.log(gravatarUrl);
	return gravatarUrl;
};

module.exports = mongoose.model("User", UserSchema);
