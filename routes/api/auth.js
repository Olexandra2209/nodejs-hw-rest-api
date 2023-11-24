const express = require("express");

const AuthController = require("../../controllers/auth");

const router = express.Router();

const { auth } = require("../../middleware/auth");

const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, auth, AuthController.login);
router.post("/logout", auth, AuthController.logout);

module.exports = router;
