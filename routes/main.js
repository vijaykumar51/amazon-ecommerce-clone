var router = require("express").Router();

var Product = require("../models/product");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/products/:id", (req, res, next) => {
	Product.find({ category: req.params.id })
		.populate("category")
		.exec((err, products) => {
			if (err) return next(err);
			res.render("main/category", {
				products: products
			});
		});
});

module.exports = router;
