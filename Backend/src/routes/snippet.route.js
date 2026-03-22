const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createSnippet,
  getUserSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} = require("../controllers/snippet.controller");

// CRUD
router.post("/", auth, createSnippet);
router.get("/", auth, getUserSnippets);
router.get("/:id", auth, getSnippetById);
router.put("/:id", auth, updateSnippet);
router.delete("/:id", auth, deleteSnippet);

module.exports = router;
