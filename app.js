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
  console.log("Connected to MySQL!!!");
});

app.get("/setup", async (req, res) => {
  let fb_id = req.query.fb_id;
  let mssv = req.query.mssv;
  let pass = req.query.pass;

  //insert db

  con.query(
    "SELECT * FROM mssv WHERE MSSV = " + mssv + " LIMIT 1",
    async function (err, result, fields) {
      if (err) throw err;

      if (!result[0]) {
        try {
          await API.login({
            user: mssv,
            pass: pass,
          });
          con.query(
            "INSERT INTO `mssv` (`FB_ID`, `MSSV`, `PASS`) VALUES ('" +
              fb_id +
              "', '" +
              mssv +
              "', '" +
              pass +
              "')",
            function (err, res, fields) {
              if (err) throw err;
            }
          );

          res.json({
            messages: [
              {
                text:
                  "Cấu hình thông tin tài khoản thành công, chúng tôi sẽ bảo mật tài khoản của bạn một cách an toàn nhất có thể !!!",
              },
            ],
          });
        } catch (e) {
          console.log("[SETUP]: " + e);
          res.json({
            messages: [
              {
                text: "Tài khoản hoặc mật khẩu không đúng !!!",
              },
            ],
          });
        }
      } else {
        console.log(result[0].id);
        res.json({
          messages: [
            {
              text: "Mã sinh viên đã tồn tại !!!",
            },
          ],
        });
      }
    }
  );
});

app.get("/getTKB/:fb_id", async (req, res) => {

    let fb_id = req.params.fb_id;
  
    con.query("SELECT * FROM mssv WHERE FB_ID = " + fb_id + " LIMIT 1", async function (err, result, fields) {
      if (err) throw err;
  
      if (result[0]) {
  
        console.log(fb_id + " | " + result[0].MSSV);
        let tkb = await TDMU.getTKB(result[0].MSSV);
  
        res.json({
          messages: [
            {
              text: tkb
            }
          ]
        });
  
      } else
        res.json({
          "messages": [
            {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "button",
                  "text": "setup!",
                  "buttons": [
                    {
                      "type": "show_block",
                      "block_names": ["setup"],
                      "title": "Setup"
                    },
                  ]
                }
              }
            }
          ]
  
  
  
        });
  
  
    });
  });

app.get("/news", async (req, res) => {
  let news = await TDMU.getNewsTDMU();
  res.json({
    messages: [
      {
        text: news,
      },
    ],
  });
});

app.get("/diem/:fb_id", async (req, res) => {
  let fb_id = req.params.fb_id;
  con.query(
    "SELECT * FROM mssv WHERE FB_ID = " + fb_id + " LIMIT 1",
    async function (err, result, fields) {
      if (err) throw err;

      if (result[0]) {
        console.log(fb_id + " | " + result[0].MSSV);
        let diem = await TDMU.getAllMark(result[0].MSSV, result[0].PASS);
        res.json({
          messages: [
            {
              text: diem,
            },
          ],
        });
      } else
        res.json({
          messages: [
            {
              attachment: {
                type: "template",
                payload: {
                  template_type: "button",
                  text: "setup!",
                  buttons: [
                    {
                      type: "show_block",
                      block_names: ["setup"],
                      title: "Setup",
                    },
                  ],
                },
              },
            },
          ],
        });
    }
  );
});

app.use("/TKB", function (req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("TKB!\n\n💚 🔒.js");
});

// DO NOT DO app.listen() unless we're testing this directly
if (require.main === module) {
  app.listen(3000);
}

// Instead do export the app:
module.exports = app;
