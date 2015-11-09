import express from 'express';
import paginate from 'express-paginate';
import Article from '../article';

var router = express.Router();

router.get('/', (req, res, next) => {
  Article.paginate( {}, { page: req.query.page, limit: req.query.limit },
    (err, articles, pageCount, itemCount) => {
      if (err) return next(err);

      res.format({
        json: function() {
          res.json({
            object: 'list',
            has_more: paginate.hasNextPages(req)(pageCount),
            data: articles
          });
        }
      });
    }
  );
});

module.exports = router;
