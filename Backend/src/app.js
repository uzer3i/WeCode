require("dotenv").config();
const express = require("express");
const app = express();
const cookireParser = require("cookie-parser");

app.use(express.json());
app.use(cookireParser());

module.exports = app;
