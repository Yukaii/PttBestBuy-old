/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _crawler = __webpack_require__(2);

	var _crawler2 = _interopRequireDefault(_crawler);

	var _mongoose = __webpack_require__(8);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _express = __webpack_require__(11);

	var _express2 = _interopRequireDefault(_express);

	var _path = __webpack_require__(12);

	var _path2 = _interopRequireDefault(_path);

	var _serveFavicon = __webpack_require__(13);

	var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

	var _morgan = __webpack_require__(14);

	var _morgan2 = _interopRequireDefault(_morgan);

	var _cookieParser = __webpack_require__(15);

	var _cookieParser2 = _interopRequireDefault(_cookieParser);

	var _bodyParser = __webpack_require__(16);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _expressPaginate = __webpack_require__(17);

	var _expressPaginate2 = _interopRequireDefault(_expressPaginate);

	var _nodeSchedule = __webpack_require__(18);

	var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

	var app = (0, _express2['default'])();
	_mongoose2['default'].connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ptt-best-buy');

	_nodeSchedule2['default'].scheduleJob('*/2 * * * *', function () {
	  var mbkanban = new _crawler2['default']();
	  mbkanban.parseListFrom("mobilesales");
	});

	app.use(_expressPaginate2['default'].middleware(50, 100));

	var articlesRouter = __webpack_require__(19);
	app.use('/articles', articlesRouter);

	// app.use(express.static(__dirname + '../dist'));

	// view engine setup
	// app.set('views', path.join(__dirname, 'views'));
	// app.set('view engine', 'jade');

	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use((0, _morgan2['default'])('dev'));
	app.use(_bodyParser2['default'].json());
	app.use(_bodyParser2['default'].urlencoded({ extended: false }));
	app.use((0, _cookieParser2['default'])());
	app.use(_express2['default']['static'](_path2['default'].join(__dirname, 'public')));

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	  app.use(function (err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function (err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});

	app.listen(process.env.PORT || 3000);

	module.exports = app;
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _cheerio = __webpack_require__(3);

	var _cheerio2 = _interopRequireDefault(_cheerio);

	var _bluebird = __webpack_require__(4);

	var _bluebird2 = _interopRequireDefault(_bluebird);

	var _nodeFetch = __webpack_require__(5);

	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

	var _moment = __webpack_require__(6);

	var _moment2 = _interopRequireDefault(_moment);

	var _modelsArticle = __webpack_require__(7);

	var _modelsArticle2 = _interopRequireDefault(_modelsArticle);

	var Crawler = (function () {
	  function Crawler() {
	    _classCallCheck(this, Crawler);
	  }

	  _createClass(Crawler, [{
	    key: 'pttRequest',
	    value: function pttRequest(kanban, pageCount) {
	      var requestUrl = 'https://www.ptt.cc/bbs/' + kanban + '/index' + pageCount + '.html';

	      return (0, _nodeFetch2['default'])(requestUrl).then(function (res) {
	        return res.text();
	      }).then(function (body) {
	        var $ = _cheerio2['default'].load(body);

	        var pageContents = [];
	        $('.r-ent').each(function (index, element) {
	          // find or create should be better...
	          var relUrl = $(element).find('.title a').attr('href');
	          if (relUrl === undefined) {
	            return true;
	          };
	          var url = 'https://www.ptt.cc' + relUrl;
	          var title = $(element).find('.title').text().trim();
	          var author = $(element).find('.author').text();

	          _modelsArticle2['default'].findOne({ 'url': url }, function (err, art) {
	            var article = null;
	            if (art === null) {
	              article = new _modelsArticle2['default']({
	                url: url,
	                title: title,
	                author: author
	              });
	            } else {
	              article = art;
	            }
	            pageContents[index] = article;
	          });
	        });

	        // 清除置頂文
	        if ($('.r-list-sep').length > 0) {
	          var titles = $('.r-ent').parent().children().map(function (index, element) {
	            return $(element).find('.title').text().trim();
	          }).toArray();

	          pageContents = pageContents.slice(0, titles.indexOf(""));
	        }

	        return pageContents;
	      });
	    }
	  }, {
	    key: 'parseListFrom',
	    value: function parseListFrom(kanban) {
	      var _this = this;

	      var page = arguments.length <= 1 || arguments[1] === undefined ? 20 : arguments[1];

	      (0, _nodeFetch2['default'])('https://www.ptt.cc/bbs/' + kanban + '/index.html').then(function (res) {
	        return res.text();
	      }).then(function (body) {
	        var $ = _cheerio2['default'].load(body);

	        var lastLastestPage = $('a:contains("‹ 上頁")').attr('href');
	        var currentPageCount = parseInt(/index(\d+)/.exec(lastLastestPage)[1]) + 1;

	        var pageCounts = [];
	        for (var i = 0; i < page; i++) {
	          pageCounts.push(currentPageCount - i);
	        }

	        _bluebird2['default'].map(pageCounts, function (pageCount) {
	          return _this.pttRequest(kanban, pageCount);
	        }).then(function (results) {
	          var articles = [].concat.apply([], results);
	          console.log('parse total ' + articles.length + ' articles at ' + new Date().toLocaleString());

	          _bluebird2['default'].each(articles, function (article) {
	            if (article === undefined || article.url === undefined) return true;
	            return (0, _nodeFetch2['default'])(article.url).then(function (res) {
	              return res.text();
	            }).then(function (body) {
	              var $ = _cheerio2['default'].load(body);

	              article.posted_at = (0, _moment2['default'])($('.article-meta-value').last().text() + ' +0800', 'ddd MMM DD HH:mm:ss YYYY Z').toDate();
	              article.raw_html = $('#main-content').html();
	              article.content = $('#main-content').text();

	              article.save();
	              return article;
	            });
	          });

	          return articles;
	        });
	      });
	    }
	  }]);

	  return Crawler;
	})();

	exports['default'] = Crawler;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("cheerio");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("node-fetch");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _mongoose = __webpack_require__(8);

	var _mongoose2 = _interopRequireDefault(_mongoose);

	var _mongoosePaginate = __webpack_require__(9);

	var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

	var _supergoose = __webpack_require__(10);

	var _supergoose2 = _interopRequireDefault(_supergoose);

	var Schema = _mongoose2['default'].Schema;

	var articleSchema = new Schema({
	    title: String,
	    url: { type: String, unique: true },
	    author: String,
	    raw_html: String,
	    content: String,
	    price: Number,
	    product: String,
	    updated_at: Date,
	    created_at: Date,
	    posted_at: Date
	});

	articleSchema.plugin(_mongoosePaginate2['default']);
	articleSchema.plugin(_supergoose2['default']);

	var Article = _mongoose2['default'].model('Article', articleSchema);
	module.exports = Article;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("mongoose");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("mongoose-paginate");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("supergoose");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("serve-favicon");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("cookie-parser");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("express-paginate");

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("node-schedule");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _express = __webpack_require__(11);

	var _express2 = _interopRequireDefault(_express);

	var _expressPaginate = __webpack_require__(17);

	var _expressPaginate2 = _interopRequireDefault(_expressPaginate);

	var _modelsArticle = __webpack_require__(7);

	var _modelsArticle2 = _interopRequireDefault(_modelsArticle);

	var router = _express2['default'].Router();

	router.get('/', function (req, res, next) {
	  _modelsArticle2['default'].paginate({}, { page: req.query.page, limit: req.query.limit, sortBy: { posted_at: -1 } }, function (err, articles, pageCount, itemCount) {
	    if (err) return next(err);

	    var articleJson = function articleJson() {
	      res.json({
	        object: 'list',
	        has_more: _expressPaginate2['default'].hasNextPages(req)(pageCount),
	        data: articles
	      });
	    };

	    res.format({
	      json: articleJson,
	      text: articleJson,
	      html: articleJson
	    });
	  });
	});

	module.exports = router;

/***/ }
/******/ ]);