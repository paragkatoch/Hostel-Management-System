const router = require("express").Router();

// login
router.post("/login");

// signup
router.post("signup");

// changepassword
router.post("/changepassword/:token");

// logout
router.post("/logout");

module.exports = router;
