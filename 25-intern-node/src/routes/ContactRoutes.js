const express = require("express");
const router = express.Router();
const contactController = require("../controllers/ContactController");
// const authMiddleware = require("../middleware/authMiddleware");

// Submit contact form (no auth required)
router.post("/submit", contactController.submitContactForm);

// Get all contact messages (admin only)
router.get("/messages",contactController.getContactMessages);

module.exports = router;



