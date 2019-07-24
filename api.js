const twitter = require('./comp/twitter');
const utils = require('./comp/utils');
const renderError = require('./comp/utils.rendering').renderError
    , renderUiError = require('./comp/utils.rendering').renderUiError;

const friTease = (req) => twitter.friTease({ friTease: true, ...req.query });

const init = (app) => {

    ////////////////////////////////////
    // API Endpoints
    app.get('/api/users', (req, res) => {
        const options = {
            screen_name: req.params.users || []
        };
        twitter.getUsers(options)
            .then(results => {
                res.send({
                    status: 200,
                    body: results
                });
            })
            .catch(e => renderError(res, e));
    });

    app.get('/api/friTease', (req, res) => {
        friTease(req)
            .then((body) => res.send({ status: 200, body }))
            .catch(e => renderUiError(res, e));
    });

    app.get('/api/user', (req, res) => {
        twitter.getUser(req.query)
            .then(user => {
                res.send(user.data);
            })
            .catch(e => {
                res.send({ status: 500, error: e });
            });
    });

    app.get('/api/postPrompt', (req, res) => {
        let mediaFilePath = `./../public${req.query.imageUrl}`
            , statusText = req.query.statusText;
        twitter.uploadMediaChunks(utils.absolutePath(mediaFilePath))
            .then(mediaId => {
                console.log(`\tmediaId ${mediaId}`);
                let status = {
                    status: statusText,
                    media_ids: mediaId // Pass the media id string
                };
                twitter.makePost(twitter.endpoints.postTweet, status)
                    .then(result => {
                        console.log(`SUCCESS!`);
                        res.send({
                            status:200,
                            data: result
                        });
                    })
            })
            .catch(e => {
                console.error(`WAH WAH WAHHHHHH! \n${e.allErrors.map(err => err.message).join('\n') || e.message || JSON.stringify(e)}`);
                res.send({
                    status: 500,
                    error: e.allErrors || e.message || e.stack || e
                });
            })
    });
}

module.exports = {
    init
}
