"use strict";

var cheerio = require('cheerio');
var request = require('request');

request("https://www.ptt.cc/bbs/mobilesales/index.html", function(error, response, html) {
  if (!error) {
    var $ = cheerio.load(html);

    var pageContents = $('.r-ent').map(function(index, element) {
      return {
        'title': $(element).find('.title').text().trim(),
        'url': $(element).find('.title a').attr('href'),
        'author': $(element).find('.author').text()
      };
    }).toArray();

    if( $('.r-list-sep').length > 0 ) {
      var titles = $('.r-ent').parent().children().map(function(index, element) {
        return $(element).find('.title').text().trim()
      }).toArray();

      pageContents = pageContents.slice(0, titles.indexOf(""));
    }

    console.log(pageContents);
  }
})
