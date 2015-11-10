"use strict";

import cheerio from 'cheerio';
import Promise from 'bluebird';
import fetch from 'node-fetch';
import moment from 'moment';

import Article from './models/article';

export default class Crawler {
  pttRequest(kanban, pageCount) {
    var requestUrl = `https://www.ptt.cc/bbs/${kanban}/index${pageCount}.html`;

    return fetch(requestUrl)
      .then( res => res.text() ).then( body => {
        var $ = cheerio.load(body);

        var pageContents = [];
        $('.r-ent').each( (index, element) => {
          // find or create should be better...
          var relUrl = $(element).find('.title a').attr('href');
          if ( relUrl === undefined ) { return true };
          var url = `https://www.ptt.cc${relUrl}`;
          var title = $(element).find('.title').text().trim();
          var author = $(element).find('.author').text();

          Article.findOne({ 'url': url }, (err, art) => {
            var article = null;
            if ( art === null ) {
              article = new Article({
                url: url,
                title: title,
                author: author
              })
            } else {
              article = art;
            }
            pageContents[index] = article;
          });
        });

        // 清除置頂文
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
          console.log(`parse total ${articles.length} articles at ${new Date().toLocaleString()}`);

          Promise.each(articles, (article) => {
            if (article.url === undefined || article === undefined) return true;
            return fetch(article.url)
              .then( res => res.text() ).then( body => {
                var $ = cheerio.load(body);

                article.posted_at = moment(`${$('.article-meta-value').last().text()} +0800`, 'ddd MMM DD HH:mm:ss YYYY Z').toDate();
                article.raw_html = $('#main-content').html();
                article.content = $('#main-content').text();

                article.save();
                return article;
              }
            );
          });

          return articles;
        });
      }
    );
  }
}
