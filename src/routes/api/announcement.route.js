const router = require("express").Router();

// add announcement
router.post("/");

// get compalint
router.get("/");
router.get("/:id");

// update announcement
router.patch("/:id");

// delete announcement
router.delete("/:id");

module.exports = router;
