const router = require("express").Router();

const { signup, signin } = require("../controllers/auth.controller.js");

router.post("/register", signup, function (req, res) {});

router.post("/login", signin, function (req, res) {});

module.exports = router;
