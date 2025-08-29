// routes/zeroShot.js
const express = require("express");
const { zeroShotPrompt } = require("../controllers/Controller");

const router = express.Router();

// POST /api/zero-shot
router.post("/zero-shot", zeroShotPrompt);

module.exports = router;
