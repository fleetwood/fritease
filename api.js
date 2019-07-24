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
        twitter.postPrompt(mediaFilePath, statusText)
            .then(result => {
                res.send({
                    status:200,
                    data: result
                });
            })
            .catch(e => {
                res.send({
                    status: 500,
                    error: e.allErrors || e.message || e.stack || e
                });
            });
    });
}

module.exports = {
    init
}
