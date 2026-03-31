const express = require("express");
const router = express.Router();

const {
  getCommunitySnippets,
  getSingleCommunitySnippet,
} = require("../controllers/community.controller");

// Public routes (no auth required)

// /api/community
router.get("/", getCommunitySnippets);

// /api/community/:id
router.get("/:id", getSingleCommunitySnippet);

module.exports = router;
