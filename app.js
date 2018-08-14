const http = require('http');//引入http模块
const cheerio = require('cheerio');//引入cheerio模块
const fs = require('fs');//引入fs模块

let uri = "http://sports.sina.com.cn/nba/1.shtml";

//封装http.get方法的请求
function httpGet(uri, cb) {
  http.get(uri, function (res) {
    let html = '';
    res.on('data', function (chunk) {
      html += chunk;
    });//data事件是后台返回的数据事件  携带chunk数据
    //监听end事件 一次请求响应完成
    res.on('end', function () {
      cb(html);
    });
  }).on('error', function (e) {
    console.log(e.message);//如果在访问过程中有错误产生则直接输出错误信息
  })
}
httpGet(uri, function (html) {
  let $ = cheerio.load(html);
  $("#right a").each(function (index) {
    let newsUri = $(this).attr("href");
    httpGet(newsUri, function (body) {
      let jq = cheerio.load(body);
      fs.writeFile(`./news/${index}.txt`, jq("#artibody").text(), function (err) {
        if(err){
          return console.log(err.message);
        }
        console.log("完成新闻的写入");
      });
    });
  });
});


//爬取豆瓣的例子
//把http改成https
/*httpGet('https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=100',function (doc) {
  console.log(doc);
});*/

