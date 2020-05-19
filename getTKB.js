const axios = require('axios');
const cheerio = require('cheerio');

const API_SERVER = 'http://dkmh.tdmu.edu.vn';

async function cURL(url) {
    return axios.get(url)
        .then(function (response) {
            // handle success
            return response;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

async function getTKB(user) {
    let schedule = [];
    let URL = API_SERVER + "/default.aspx?page=thoikhoabieu&sta=0&id=" + user;

    let res = await cURL(URL);

    if (res.status != 200)
        return schedule;

    let $ = await cheerio.load(res.data);

    let contentStudent = $('#ctl00_ContentPlaceHolder1_ctl00_lblContentTenSV').text().split('-');
    let classStudent = $('#ctl00_ContentPlaceHolder1_ctl00_lblContentLopSV').text().split('-');

    let parentTable = $('#ctl00_ContentPlaceHolder1_ctl00_Table1').children('tbody').children();

    parentTable.map(function () {
        $(this).children().map(function () {
            let element = $(this).attr('onmouseover');
            if (element) {
                let item = element.split(`','`);
                let startPeriod = parseInt(item[6]);
                let numberOfPeriods = parseInt(item[7]);
                schedule.push({
                    nameSubject: item[1],
                    codeSubject: item[2],
                    dayOfWeek: item[3],
                    room: item[5],
                    nameTeacher: item[8],
                    timeStart: startPeriod,
                    timeStop: startPeriod + numberOfPeriods - 1,
                });
            }
        });
    });

    let result = {
        name: contentStudent[0].trim(),
        class: classStudent[0].trim(),
        majors: classStudent[1].split(':')[1].trim(),
        specialty: classStudent[2].split(':')[1].trim(),
        schedules: schedule
    };
    return result;
}

module.exports.getTKB = async function (mssv) {
    var messenge = '';
    var data = await getTKB(mssv);
    var checkDayOfWeek = [false, false, false, false, false, false, false];

    messenge += 'Chào cậu - ' + data.name + ' (' + data.class + ')! Chúc cậu một ngày làm việc thật hiệu quả! \n Lịch học tuần này của cậu là: \n';

    var messenge_subject = '';

    data.schedules.forEach(element => {
        if (element.dayOfWeek == 'Thứ Hai') {
            checkDayOfWeek[0] = true;
        }
        if (element.dayOfWeek == 'Thứ Ba') {
            checkDayOfWeek[1] = true;
        }
        if (element.dayOfWeek == 'Thứ Tư') {
            checkDayOfWeek[2] = true;
        }
        if (element.dayOfWeek == 'Thứ Năm') {
            checkDayOfWeek[3] = true;
        }
        if (element.dayOfWeek == 'Thứ Sáu') {
            checkDayOfWeek[4] = true;
        }
        if (element.dayOfWeek == 'Thứ Bảy') {
            checkDayOfWeek[5] = true;
        }
        if (element.dayOfWeek == 'Thứ Chủ Nhật') {
            checkDayOfWeek[6] = true;
        }
    });

    for (var i = 0; i < 7; i++) {
        if (checkDayOfWeek[i] == true) {
            switch (i) {
                case 0:
                    messenge_subject += '\n🔥 Thứ Hai 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Hai') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 1:
                    messenge_subject += '\n🔥 Thứ Ba 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Ba') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 2:
                    messenge_subject += '\n🔥 Thứ Tư 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Tư') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 3:
                    messenge_subject += '\n🔥 Thứ Năm 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Năm') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 4:
                    messenge_subject += '\n🔥 Thứ Sáu 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Sáu') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 5:
                    messenge_subject += '\n🔥 Thứ Bảy 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Thứ Bảy') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;
                case 6:
                    messenge_subject += '\n🔥 Chủ Nhật 🔥';
                    data.schedules.forEach(element => {
                        if (element.dayOfWeek == 'Chủ Nhật') {
                            messenge_subject += '\n⏰ ' + element.nameSubject;
                            messenge_subject += '\n+ Phòng học: ' + element.room;
                            messenge_subject += '\n+ Giảng viên: ' + element.nameTeacher;
                            messenge_subject += '\n+ Bắt đầu: Tiết ' + element.timeStart;
                            messenge_subject += '\n+ Kết thúc: Tiết ' + element.timeStop;
                        }
                    });
                    break;

            }

        }
    }
    messenge += messenge_subject;
    return messenge;
}

const APIHuflit = require('./huflit');
const API = new APIHuflit();

module.exports.getAllMark = async function (user = '1825202010034', pass = 'tlong01@') {
    try {
        await API.login({
            user: user,
            pass: pass
        });
        let schedule = await API.getAllMark();
        var messenger = '\n Điểm kỳ trước của cậu là: ';
        messenger += '\n 🍰 Điểm trung bình học kỳ hệ 10/100: ' + schedule[schedule.length - 2].mediumScoreDec;
        messenger += '\n 🍺 Điểm trung bình tích lũy: ' + schedule[schedule.length - 2].mediumScoreGenFour;
        messenger += '\n 🍻 Số tín chỉ tích lũy: ' + schedule[schedule.length - 2].expMediumScoreGenFour;
        //console.log(messenger);
        return messenger;

    } catch (error) {
        console.log(error);
        return false;
    }
}

async function getNewsTDMU(startID = 0, category = null) {
    var news = [];
    var URL = "https://tdmu.edu.vn/News/_PartialLoadIndex?start=" + startID;
    if (category)
        URL = "https://tdmu.edu.vn/News/_PartialLoad?start=" + startID + "&idloaibd=" + category;

    let res = await cURL(URL);
    if (res.status != 200)
        return news;

    let $ = await cheerio.load(res.data);
    $('body > div.new_item').each(function (index) {
        let name = $(this).find('div.row > div.col-lg-12 > h4.new_item_title > a').text();
        let link = $(this).find('div.row > div.col-lg-12 > h4.new_item_title > a').attr('href');
        let img = $(this).find('div.row > div.col-lg-12 > img.new_item_img').attr('src');
        let desc = $(this).find('div.row > div.col-lg-12 > span.new_item_desc').text();
        let timeAndView = $(this).find('div.row > div.col-lg-12 > span.new_item_time').text().trim();

        let _timeAndView = timeAndView.split(' —  ');
        let time = _timeAndView[0];
        let view = _timeAndView[1];

        let _link = link.split('/');
        let cat = _link[2];
        let id = _link[3];

        img = img.replace('184x115_goc_', '');

        let news_item = {
            name: name,
            desc: desc,
            img: img,
            link: link,
            time: time,
            view: view,
            cat_name: cat,
            id_name: id,
        };
        news.push(news_item);
    });
    var messenge = '';
    for (var i = 0; i < 3; i++) {
        messenge += '🔥Tin tức ' + (Number(i) + 1) + ': ' + news[i].name + '\nNội dung: ' + news[i].desc + '\nChi tiết tại: https://tdmu.edu.vn' + news[i].link + '\n';
    }
    return messenge;
}

module.exports.getNewsTDMU = getNewsTDMU;