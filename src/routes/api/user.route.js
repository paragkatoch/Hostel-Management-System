const router = require("express").Router();

// add user/users
router.post("/");

// get filtered users
router.get("/");

// get user
router.get("/:id");

// update user
router.patch("/:id");

// delete user
router.delete("/:id");

// add attendance
router.post("/attendance");

// get attendance
router.get("/attendance");
router.get("/attendance/:date");

// update attendance
router.patch("/attendance/:date");
router.delete("/attendance/:date");

module.exports = router;
