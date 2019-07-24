const config = require('./config');
const utils = require('./../comp/utils');
const moment = utils.moment
    , path = utils.path
    , fs = utils.fs;
const mime = require('mime');
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
    access_token: config.TW_ACCESS_TOKEN,
    access_token_secret: config.TW_ACCESS_TOKEN_SECRET,
    app_only_auth: false,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
});

/**
 * Various twitter endpoints
 * @property {String} endpoints.searchTweets search/tweets
 * @property {String} endpoints.fullArchive tweets/search/fullarchive/dev
 * @property {String} endpoints.searchUsers users/lookup
 * @property {String} endpoints.getUser users/show
 * @property {String} endpoints.mediaUpload media/upload
 * @property {String} endpoints.postTweet statuses/update
 */
const endpoints = {
    searchTweets: 'search/tweets',
    fullArchive: 'tweets/search/fullarchive/dev',
    searchUsers: 'users/lookup',
    getUser: 'users/show',
    mediaUpload: 'media/upload',
    postTweet : 'statuses/update'
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

/**
 * (Utility function) Send a POST request to the Twitter API
 * @param String endpoint  e.g. 'statuses/upload'
 * @param Object params    Params object to send
 * @return Promise         Rejects if response is error
 */
const makePost = (endpoint, params) => new Promise((resolve, reject) => {
    twitter.post(endpoint, params, (error, data, response) => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    });
});

const mediaUpload = (mediaFilePath) => new Promise((resolve, reject) => {
    let mediaType = mime.getType(mediaFilePath)
        , mediaFileSizeBytes = fs.statSync(mediaFilePath).size;
    console.log(`Uploading ${mediaFilePath}...`);
    twitter.post(endpoints.mediaUpload, {
        'command': 'INIT',
        'media_type': mediaType,
        'total_bytes': mediaFileSizeBytes
    }, (err, bodyObj, resp) => {
        let mediaIdStr = bodyObj.media_id_string
            , isStreamingFile = true
            , isUploading = false
            , segmentIndex = 0;
        let fStream = fs.createReadStream(mediaFilePath, { highWaterMark: 5 * 1024 * 1024 });

        const finalizeMedia = (mediaIdStr, cb) => {
            console.log('\tFinalizing....');
            twitter.post('media/upload', 'media/upload', {
                'command': 'FINALIZE',
                'media_id': mediaIdStr
            }, cb)
        }

        const finalizeResult = (err, results, resp) => {
            console.log('DONE!!');
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        }

        fStream.on('data', function (buff) {
            fStream.pause();
            isStreamingFile = false;
            isUploading = true;

            console.log('\tAppending....')
            twitter.post('media/upload', {
                'command': 'APPEND',
                'media_id': mediaIdStr,
                'segment_index': segmentIndex,
                'media': buff.toString('base64'),
            }, (err, bodyObj, resp) => {
                isUploading = false;

                if (!isStreamingFile) {
                    finalizeMedia(mediaIdStr, finalizeResult);
                }
            });
        });

        fStream.on('end', function () {
            isStreamingFile = false;
            console.log('\tStreaming...');

            if (!isUploading) {
                finalizeMedia(mediaIdStr, finalizeResult);
            }
        });
    });
});

const postPrompt = (mediaFilePath, status) => new Promise((resolve, reject) => {
    fs.readFileAsync(path.join(__dirname, mediaFilePath), 'base64')
        .then(filedata => {

            // first we must post the media to Twitter
            twitter.post('media/upload', { media_data: filedata }, (err, data, response) => {
                if (err) reject(err);
                // now we can assign alt text to the media, for use by screen readers and
                // other text-based presentations and interpreters
                var mediaIdStr = data.media_id_string
                var altText = "Small flowers in a planter on a sunny balcony, blossoming."
                var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

                twitter.post('media/metadata/create', meta_params, (err, data, response) => {
                    if (err) reject(err);
                    else {
                        // now we can reference the media and post a tweet (media will attach to the tweet)
                        var params = { status: status, media_ids: [mediaIdStr] }

                        twitter.post('statuses/update', params, function (err, data, response) {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    }
                });
            });
        })
        .catch(e => reject(e));
});

/**
 * Four-step process to upload a media chunk.
 * @param {String} filename The absolute path of the file to upload.
 * @returns {String} mediaId The generated id of the uploaded media file.
 */
const uploadMediaChunks = (filename) => new Promise((resolve, reject) => {
    console.log(`uploadMediaChunks ${filename}...`);
    let mediaData
        , mediaType = mime.getType(filename)
        , mediaSize = fs.statSync(filename).size;

    /**
     * Step 1 of 4: Read the file into base64 chunk
     * @return Promise upon completion
     */
    const getMediaData = () => new Promise((done) => {
        console.log(`\tReading file...`);
        fs.readFileAsync(filename, 'base64')
            .then(data => {
                mediaData = data;
                done();
            });
    });

    /**
     * Step 2 of 4: Initialize a media upload
     * @return Promise resolving to String mediaId
     */
    function initUpload() {
        console.log(`\tInitializing...`);
        return makePost(endpoints.mediaUpload, {
            command: 'INIT',
            total_bytes: mediaSize,
            media_type: mediaType,
        }).then(data => data.media_id_string);
    }

    /**
     * Step 3 of 4: Append file chunk
     * @param String mediaId    Reference to media object being uploaded
     * @return Promise resolving to String mediaId (for chaining)
     */
    function appendUpload(mediaId) {
        console.log(`\tAppending...`);
        return makePost(endpoints.mediaUpload, {
            command: 'APPEND',
            media_id: mediaId,
            media: mediaData,
            segment_index: 0
        }).then(data => mediaId);
    }

    /**
     * Step 4 of 4: Finalize upload
     * @param String mediaId   Reference to media
     * @return Promise resolving to mediaId (for chaining)
     */
    function finalizeUpload(mediaId) {
        console.log(`\tFinalizing...`);
        return makePost(endpoints.mediaUpload, {
            command: 'FINALIZE',
            media_id: mediaId
        }).then(data => mediaId);
    }
    
    getMediaData() // Get the file chunks
        .then(initUpload) // Declare that you wish to upload some media
        .then(appendUpload) // Send the data for the media
        .then(finalizeUpload) // Declare that you are done uploading chunks
        .then(mediaId => resolve(mediaId)) // W00t done!!
        .catch(e => reject(e)); // Sad trombone.
});

module.exports = {
    endpoints,
    friTease,
    getTodoList,
    getUser,
    getUsers,
    getUserList,
    makePost,
    mapStatuses,
    mediaUpload,
    postPrompt,
    twitter,
    uploadMediaChunks
};
