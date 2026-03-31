const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/**
 * Middlewares
 */
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/**
 * Required routes
 */

const authRouter = require("./routes/auth.route");
const snippetRouter = require("./routes/snippet.route");
const communityRoutes = require("./routes/community.route");

/**
 * Using routes
 */

app.use("/api/auth", authRouter);

app.use("/api/snippet", snippetRouter);

app.use("/api/community", communityRoutes);

module.exports = app;