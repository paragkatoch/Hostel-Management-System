const router = require("express").Router();
const auth = require("../../controllers/auth.controller");

const localAuthentication =
	require("../../middleware/createAuthenticationMiddleware")("local");

const jwtAuthentication =
	require("../../middleware/createAuthenticationMiddleware")("jwt");

// Todo allow login if has correct auth token
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

// changepassword
// Todo: verify the token
router.get("/changepassword/:token");
// Todo: verify and change password
router.post("/changepassword/:token");

module.exports = router;
