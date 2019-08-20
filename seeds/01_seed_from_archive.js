const path = require('path')
    , modelPath = './../classes/db/models';

const model = (name) => {
    return require(path.join(modelPath,name));
}

const KnexModel = model('KnexModel')
    // , Media = model('Media')
    // , Prompt = model('Prompt')
    , Status = model('Status')
    , StatusQuote = model('StatusQuote')
    , StatusRetweet = model('StatusRetweet')
    , Theme = model('Theme')
    , User = model('User');

const data = require('./../classes/mocks/twitter.searchTweets.json');

// exports.seed = function(knex, Promise) {
    const twitterToStatus = KnexModel.mapTypes.twitterToStatus;
    let statuses = data.results.map(s => {
        return s.retweeted_status != null
            ? new StatusRetweet(s, twitterToStatus)
            : s.quoted_status != null
                ? new StatusQuote(s, twitterToStatus)
                : new Status(s, twitterToStatus);
    });
    statuses.forEach(async status => await status.save());
// };