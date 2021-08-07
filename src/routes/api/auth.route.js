const router = require("express").Router();
const auth = require("../../controllers/auth.controller");

const localAuthentication =
	require("../../middleware/createAuthenticationMiddleware")("local");

// Todo allow login if has correct auth token
// login
// Todo: should check user and if everything ok then should return a jwt token
router.post(
	"/login",
	auth.validateLoginPayload,
	localAuthentication,
	auth.login
);

// logout
// Todo: remove jwt token of the user
router.post("/logout");

// signup
// Todo: should check the user if exists in db or already registered and then should return an appropriate response
router.post("/signup");

// changepassword
// Todo: verify the token
router.get("/changepassword/:token");
// Todo: verify and change password
router.post("/changepassword/:token");

module.exports = router;
