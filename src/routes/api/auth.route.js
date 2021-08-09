const router = require("express").Router();

const auth = require("../../controllers/auth.controller");
const { createAuth } = require("../../middleware/createAuthMiddleware");

const localAuthentication = createAuth("local");
const jwtAuthentication = createAuth("jwt");

// TODO allow login if has correct auth token
// login
router.post(
	"/login",
	auth.validateLoginPayload,
	localAuthentication,
	auth.login
);

// logout
router.post("/logout", jwtAuthentication, auth.logout);

// signup
router.post("/signup", auth.validateSignupPayload, auth.signup);

// check changepassword token
router.get("/changepassword/:token", auth.changePasswordCheck);
// changepassword
router.patch("/changepassword/:token", auth.changePassword);

module.exports = router;
