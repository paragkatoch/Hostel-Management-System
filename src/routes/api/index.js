const express = require("express");

const router = express.Router();

router.get("/alive", (req, res) => {
	res.status(200).json({ status: "working" });
});

router.use("/auth", require("./auth.route"));
router.use("/users", require("./user.route"));
router.use("/complaints", require("./complaint.route"));
router.use("/announcements", require("./announcement.route"));

module.exports = router;
