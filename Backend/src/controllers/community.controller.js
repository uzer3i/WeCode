const Snippet = require("../models/snippet.model");


// ✅ GET ALL PUBLIC SNIPPETS (COMMUNITY FEED)
exports.getCommunitySnippets = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      isPublic: true,
      isDeleted: false,
      title: { $regex: search, $options: "i" }, // search by title
    };

    const snippets = await Snippet.find(query)
      .populate("author", "username email") // only selected fields
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Snippet.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      snippets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET SINGLE PUBLIC SNIPPET
exports.getSingleCommunitySnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate("author", "username email");

    if (!snippet || !snippet.isPublic || snippet.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Snippet not found",
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