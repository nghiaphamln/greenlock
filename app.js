"use strict";

var express = require("express");
var app = express();
const APIHuflit = require("./huflit");
const API = new APIHuflit();
const TDMU = require("./getTKB");

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nghia@123",
  database: "gettkb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!!");
});

app.get("/news", async (req, res) => {
    let news = await TDMU.getNewsTDMU();
    res.json({
        messages: [
          {
            text: news
          }
        ]
      });
});

app.use("/TKB", function (req, res)  {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("TKB!\n\n💚 🔒.js");
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
  app.listen(3000);
}

// Instead do export the app:
module.exports = app;
