const express = require('express');
const router = express.Router();
const Twit = require('twit'); 
const config = require('config').get('twitter');

const T = new Twit(config);
const params = { q: '#FriTease johnfpendleton', count: 10 } 

const searchedData = (err, data, response) => {
 return `Here's your data yall`;
}

/* GET home page. */
router.get('/', (req, res, next) => {
  T.get('search/tweets', params, searchedData)
  .then(results => {
    res.render('json', { title: 'FriTease',  message: results, json: JSON.stringify(results, null, 2)});
  })
  .catch(error => {
    res.render('json', {title: 'Nope', message: `Shit broke: ${error.message}`})
  })
});

module.exports = router;
