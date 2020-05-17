"use strict";

var express = require("express");
var app = express();

app.use("/news", function(req, res) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("News!\n\n💚 🔒.js");
});

app.use("/TKB", function(req, res) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end("TKB!\n\n💚 🔒.js");
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
    app.listen(3000);
}

// Instead do export the app:
module.exports = app;