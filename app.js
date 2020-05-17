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

  con.query(
    "SELECT * FROM mssv WHERE FB_ID = " + fb_id + " LIMIT 1",
    async function (err, result, fields) {
      if (err) throw err;

      if (result[0]) {
        console.log(fb_id + " | " + result[0].MSSV);
        let tkb = await TDMU.getTKB(result[0].MSSV);

        res.json({
          messages: [
            {
              text: tkb,
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

app.get("/totnghiep", async (req, res) => {
  var content =
    "1. Điều kiện xét tốt nghiệp:\n- Không bị truy cứu trách nhiệm hình sự hoặc không bị kỷ luật từ mức đìnhc chỉ trở lên\n- Tích lũy đủ số học phần quy định trong Chương trình đào tạo\n- Điểm trung bình từ 5,0 trở lên\n- Có chứng chỉ giáo dục quốc phòng\n- Đạt yêu cầu về Giáo dục thể chất theo quy định của trường. \n2. Điều kiện công nhận tốt nghiệp: \n- Được tốt nghiệp theo mục 1\n- Được hội đồng xét tốt nghiệp cấp trường thông qua và trình Hiệu trưởng ban hành quyết định công nhận\n3. Điều kiện cấp bằng tốt nghiệp:\n- Được công nhận tốt nghiệp theo mục 2\n- Có các chứng chỉ theo quy định đầu ra của trường về ngoại ngữ, tin học, kỹ năng xã hội.";
  res.json({
    messages: [
      {
        text: content,
      },
    ],
  });
});

app.get("/chuyennganh", async (req, res) => {
  var content =
    "Sinh viên được chuyển ngành học nếu thỏa mãn các điều kiện: Ngành chuyển đến có cùng khối thi tuyển sinh với ngành chuyển đi và điểm thi phải cao hơn hoặc bằng điểm trúng tuyển của ngành chuyển đến trong cùng năm nhập học. Không được chuyển ngành trong năm học thứ nhất và năm học cuối khóa học. Sinh viên không thuộc diện cảnh báo học vụ hoặc bị buộc thôi học.\nSinh viên chỉ được xét chuyển ngành trong một lần trong suốt khóa học, tùy theo năng lực của khoa tiếp nhận. Hồ sơ xin chuyển ngành nộp phòng Đào tạo 15 ngày trước kho bắt đầu năm học mới. Sau khi được chuyển ngành, sinh viên phải tích lũy đầy đủ chương trình đào tạo của ngành mới trong thời gian được phép còn lại của ngành học cũ.";
  res.json({
    messages: [
      {
        text: content,
      },
    ],
  });
});

app.get("/hocbong", async (req, res) => {
  var content =
    "1. Đối tượng được cấp, xét học bổng\n- Sinh viên hệ chính quy được xếp loại học tập và rèn luyện trong học kỳ xét học bổng từ loại khá trở lên, không bị xử lí kỷ luật với bất kì hình thức nào\n- Sinh viên thuộc diện hưởng học bổng chính sách, trợ cấp xã hội và chính sách ưu đãi theo quy định hiện hành thì ngoài chế độ đang được hưởng, nếu đạt kết quả xếp loại học tập và rèn luyện trong học kì từ khá trở lên cũng được xét, cấp học bổng như các sinh viên khác\n2. Tiêu chuẩn xếp loại\n- Xuất sắc:\n+ Điểm từ 9 đến 10\n+ Kết quả rèn luyện loại xuất sắc\n- Giỏi:\n+ Đạt điểm từ 8 đến cận 9\n+ Kết quả rèn luyện loại tốt trở lên\n- Khá:\n+ Đạt điểm từ 7 đến cận 8\n+ Kết quả rèn luyện loại khá trở lên";
  res.json({
    messages: [
      {
        text: content,
      },
    ],
  });
});

if (require.main === module) {
  app.listen(3000);
}

// Instead do export the app:
module.exports = app;
