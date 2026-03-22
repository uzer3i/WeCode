const Snippet = require("../models/snippet.model");

// CREATE SNIPPET
exports.createSnippet = async (req, res) => {
  try {
    const { title, html, css, js, language, isPublic } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!title || !html) {
      return res.status(400).json({
        success: false,
        message: "Title and HTML are required",
      });
    }

    const snippet = await Snippet.create({
      title,
      html: html || "",
      css: css || "",
      js: js || "",
      isPublic: isPublic ?? true,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      snippet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL SNIPPETS (OF LOGGED IN USER)
exports.getUserSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({
      author: req.user.id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      snippets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE SNIPPET
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found",
      });
    }

    // check ownership OR public access
    if (snippet.author.toString() !== req.user.id && !snippet.isPublic) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.json({
      success: true,
      snippet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE SNIPPET
exports.updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found",
      });
    }

    // only owner can update
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await Snippet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      snippet: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SNIPPET (SOFT DELETE)
exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet || snippet.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found",
      });
    }

    // only owner
    if (snippet.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    snippet.isDeleted = true;
    await snippet.save();

    res.json({
      success: true,
      message: "Snippet deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
