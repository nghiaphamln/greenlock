"use strict";

const APP_SECRET = "abe11a2c4f36b4be64497e4025f6a065";
const VALIDATION_TOKEN = "minh-nghia";
const PAGE_ACCESS_TOKEN = "EAAD7RaVAYZAIBAONSrFoQVPkXQ2dyDfRZC5MXYqipq1jiBQ3ZBdUZArf0SZA0cNY6US49y6H37uohvQ0tA864ry1PtNENjRQuk2tVxlCrVe9ZCHRRoHekSDLEJu4cOpt4d1JTnuFfeNlnthJFxZAdTO07fW3mvMlZApBZCFSjC0dQqJYgoD54CLBZCE6wUsSEVkesZD";

var apps = require("./app.js");

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",

    maintainerEmail: "nghiaphamln3@gmail.com",

    cluster: false,
  })
  .serve(apps);

var http = require("http");
var bodyParser = require("body-parser");
var express = require("express");

var app = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
var server = http.createServer(app);
var request = require("request");

app.get("/", (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get("/webhook", function (req, res) {
  // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query["hub.verify_token"] === VALIDATION_TOKEN) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong validation token");
});

app.post("/webhook", function (req, res) {
  // Phần sử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
}

app.set("port", process.env.PORT || 5000);
app.set("ip", process.env.IP || "0.0.0.0");

server.listen(app.get("port"), app.get("ip"), function () {
  console.log(
    "Chat bot server listening at %s:%d ",
    app.get("ip"),
    app.get("port")
  );
});
