const router = require("express").Router();

// add complaint
router.post("/");

// get compalint
router.get("/");
router.get("/:id");

// update complaint
router.patch("/:id");

// delete complaint
router.delete("/:id");

module.exports = router;
