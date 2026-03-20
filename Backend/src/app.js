const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

/**
 * Middlewares
 */
app.use(express.json());
app.use(cookieParser());

/**
 * Required routes
 */

const authRouter = require("./routes/auth.route");

/**
 * Using routes
 */

app.use("/api/auth", authRouter);

module.exports = app;
