"use strict";

import cheerio from 'cheerio';
import Promise from 'bluebird';
import fetch from 'node-fetch';

export default class Crawler {
  pttRequest(kanban, pageCount) {
    var requestUrl = `https://www.ptt.cc/bbs/${kanban}/index${pageCount}.html`;

    return fetch(requestUrl)
      .then( res => res.text() ).then( body => {
        var $ = cheerio.load(body);

        var pageContents = $('.r-ent').map(function(index, element) {
          return {
            'title': $(element).find('.title').text().trim(),
            'url': $(element).find('.title a').attr('href'),
            'author': $(element).find('.author').text(),
          };
        }).toArray();

        if( $('.r-list-sep').length > 0 ) {
          var titles = $('.r-ent').parent().children().map(function(index, element) {
            return $(element).find('.title').text().trim();
          }).toArray();

          pageContents = pageContents.slice(0, titles.indexOf(""));
        }

        return pageContents;
      }
    );
  }

  parseListFrom(kanban, page = 20) {
    fetch(`https://www.ptt.cc/bbs/${kanban}/index.html`)
      .then( res => res.text() ).then( body => {
        var $ = cheerio.load(body);

        var lastLastestPage = $('a:contains("‹ 上頁")').attr('href');
        var currentPageCount = parseInt(/index(\d+)/.exec(lastLastestPage)[1]) + 1;

        var pageCounts = []
        for(var i = 0; i < page; i++) { pageCounts.push(currentPageCount - i); }

        Promise.map(pageCounts, pageCount => {
          return this.pttRequest(kanban, pageCount);
        }).then(function(results) {
          var articles = [].concat.apply([], results);
          // TODOs: save it, hash the url, and parse each page in cron jobs or so
          console.log(articles.length);
          return articles;
        });
      }
    );
  }
}
