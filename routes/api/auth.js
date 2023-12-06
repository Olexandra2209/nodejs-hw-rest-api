const express = require("express");

const AuthController = require("../../controllers/auth");

const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

const router = express.Router();

const jsonParser = express.json();

const UserController = require("../../controllers/UserController");

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", auth, AuthController.logout);
router.get("/current", AuthController.current);
router.get("/avatar", auth, UserController.getAvatar);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  UserController.uploadAvatar
);
router.get("/verify/:verificationToken", AuthController.verify);
router.post("/verify", AuthController.verifyResend);

module.exports = router;
