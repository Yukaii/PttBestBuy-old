"use strict";

var cheerio = require("cheerio");
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

var pttRequest = function(kanban, pageCount) {
  var requestUrl = "https://www.ptt.cc/bbs/" + kanban + "/index" + pageCount + ".html";

  return request(requestUrl).then(function(html) {
    var $ = cheerio.load(html.toString());

    var pageContents = $('.r-ent').map(function(index, element) {
      return {
        'title': $(element).find('.title').text().trim(),
        'url': $(element).find('.title a').attr('href'),
        'author': $(element).find('.author').text()
      };
    }).toArray();

    if( $('.r-list-sep').length > 0 ) {
      var titles = $('.r-ent').parent().children().map(function(index, element) {
        return $(element).find('.title').text().trim();
      }).toArray();

      pageContents = pageContents.slice(0, titles.indexOf(""));
    }

    return pageContents;
  });
}

request("https://www.ptt.cc/bbs/mobilesales/index.html").then(function(html) {
  var $ = cheerio.load(html.toString());

  var lastLastestPage = $('a:contains("‹ 上頁")').attr('href');
  var currentPageCount = parseInt(/index(\d+)/.exec(lastLastestPage)[1]) + 1;

  var pageCounts = []
  for(var i = 0; i < 20; i++) { pageCounts.push(currentPageCount - i); }

  Promise.map(pageCounts, function(pageCount) {
    return pttRequest("mobilesales", pageCount);
  }).then(function(results) {
    var articles = [].concat.apply([], results);
    // TODOs: save it, hash the url, and parse each page in cron jobs or so
    console.log(articles.length);
  });
})
