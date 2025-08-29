// routes/zeroShot.js
const express = require("express");
const { zeroShotPrompt } = require("../controllers/zeroShotController");

const router = express.Router();

// POST /api/zero-shot
router.post("/zero-shot", zeroShotPrompt);

module.exports = router;
