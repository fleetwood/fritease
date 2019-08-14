const twitter = require('./comp/twitter')
    , utils = require('./comp/utils')
    , knex = require('./comp/db/knex')
    , renderError = require('./comp/utils.rendering').renderError
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
        twitter.postPrompt(mediaFilePath, statusText, ff5_users)
            .then(result => {
                res.send({
                    status: 200,
                    data: `http://twitter.com/johnfpendleton/status/${result.id}`
                });
                knex.updateFF5_Users(ff5_users, utils.moment());
            })
            .catch(e => {
                res.send({
                    status: 500,
                    error: e.allErrors || e.message || e.stack || e
                });
            });
    });

    app.get('/api/schedulePrompt', (req, res) => {
        let date = req.query.date.split('/').map(e => Number(e));
        // subtracting a day because posting on Thursday, not Friday. pain in the ass.
        date = utils.moment().set('m', date[0]).set('D',date[1]-1);
        let options = {
                image: req.query.imageUrl,
                statustext: req.query.statusText,
                ff5_users: req.query.ff5_users,
                date: date.add(-1,'D').format(utils.dateFormats.images)
            };
        knex.saveScheduledPrompt(options)
            .then(result => {
                res.send({
                    status: 200,
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
