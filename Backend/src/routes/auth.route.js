const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);

module.exports = router;
