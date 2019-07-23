const config = require('./config');
const utils = require('./../comp/utils');
const moment = utils.moment
    , path = utils.path;
const Twit = require('twit');
const User = require('./twitter/User');
const Status = require('./twitter/Status');
const StatusReply = require('./twitter/StatusReply');
const StatusRetweet = require('./twitter/StatusRetweet');
const Query = require('./twitter/Query');
const searchTweets = './mocks/twitter.searchTweets.json';

const twitter = new Twit({
    consumer_key: config.TW_API_KEY,
    consumer_secret: config.TW_API_SECRET_KEY,
    app_only_auth: true,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

const endpoints = {
    searchTweets: 'search/tweets',
    fullArchive: 'tweets/search/fullarchive/dev',
    searchUsers: 'users/lookup',
    getUser: 'users/show'
};

const mapStatuses = (data) => {
    // map the data to objects
    let statuses = data.map(status => {
        return status.retweeted_status
            ? new StatusRetweet(status)
            : status.in_reply_to_user_id
                ? new StatusReply(status)
                : new Status(status)
    });

    // get the retweets
    const allRetweets = statuses
        .filter(f => f.isRetweet)
        .sortBy('createDate');

    // dedupe the retweets, and aggregate duplicates to facePile
    const uniques = allRetweets
        .dedupe('retweetId')
        .map(f => {
            allRetweets
                .filter(a => a.retweetId == f.retweetId && a.id !== f.id)
                .forEach(e => f.addToPile(e.user));
            return f;
        });

    // remove all retweets, put uniques back in, sort
    statuses = statuses
        .filter(f => !f.isRetweet)
        .concat(uniques)
        .sortBy('createDate', 'DESC');

    // rank users
    statuses.forEach(s => {
        s.user.addRank(s.likes + s.retweets);
    });

    return statuses;
};

const mapUsers = (data, limit = -1) => {
    const users = data
        .map(d => new User(d))
        .sortBy('rank');
    return limit > 0 ? users.limit(limit) : users;
}

const friTease = (options) => new Promise((resolve, reject) => {
    utils.getFile(path.join(__dirname, searchTweets))
        .then(data => {
            resolve(mapStatuses(data.toJson()));
        })
        .catch(e => reject(e));
    // TODO: return endpoints
    // const query = new Query(options);
    // return twitter.get(endpoints.fullArchive, query.toQuery());
});

/**
 * 
 * @param {Object} options Provide both screen_name and user_id for best results, since the API is unreliable.
 * @param {Number} options.user_id {user_id: number}
 * @param {String} options.screen_name {screen_name: string}
 * @returns {Promise<User,Error>}
 * @see User 'comp/twitter/User.js'
 */
const getUser = (options) => new Promise((resolve, reject) => {
    const done = (data) => resolve(new User(data.data));
    twitter.get(endpoints.getUser, { screen_name: options.screen_name })
        .then(result => {
            done(result);
        })
        .catch(e => {
            twitter.get(endpoints.getUser, { user_id: Number(options.user_id) })
                .then(results => {
                    done(results);
                })
                .catch(e => reject(e))
        });
});

const getUserList = (options, post) => new Promise((resolve, reject) => {
    utils.getFile(path.join(__dirname, searchTweets))
        .then(data => {

            let users = data.toJson().map(f => f.user);
            users = mapUsers(users, 20);
            users = users.dedupe('id');
            resolve(users);
        })
        .catch(e => reject(e));
});

const getTodoList = (options, post) => new Promise((resolve, reject) => {
    utils.getFile(path.join(__dirname, 'mocks/twitter.todos.json'))
        .then(res => resolve(res.toJson()))
        .catch(e => reject(e));
});

const getUsers = (options, post) => new Promise((resolve, reject) => {
    if (post) {
        twitter.post(endpoints.searchUsers, options)
            .then(results => resolve(results.stream))
            .catch(e => reject(e));
    }
    else {
        twitter.get(endpoints.searchUsers, options)
            .then(results => resolve(results.stream))
            .catch(e => reject(e));
    }
});


module.exports = {
    endpoints,
    friTease,
    getTodoList,
    getUser,
    getUsers,
    getUserList,
    mapStatuses,
    twitter
};
