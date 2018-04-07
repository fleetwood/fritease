const router = require('express').Router();

router.get('/', (req, res, next) => { // eslint-disable-line no-unused-vars
  res.render('index', { title: 'Express' });
});

module.exports = router;
