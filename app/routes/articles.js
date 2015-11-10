import express from 'express';
import paginate from 'express-paginate';
import Article from '../models/article';

var router = express.Router();

router.get('/', (req, res, next) => {
  Article.paginate( {}, { page: req.query.page, limit: req.query.limit, sortBy: { posted_at: -1 } },
    (err, articles, pageCount, itemCount) => {
      if (err) return next(err);

      var articleJson = () => {
        res.json({
          object: 'list',
          has_more: paginate.hasNextPages(req)(pageCount),
          data: articles
        });
      }

      res.format({
        json: articleJson,
        text: articleJson,
        html: articleJson
      });
    }
  );
});

module.exports = router;
