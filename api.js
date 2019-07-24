const twitter = require('./comp/twitter');
const knex = require('./comp/db/knex');
const utils = require('./comp/utils')
    , path = utils.path
    , fs = utils.fs;
const User = require('./comp/twitter/User');
const moment = utils.moment;

const friTease = (req) => twitter.friTease({ friTease: true, ...req.query });

const renderError = (res, e) => {
    console.log(e);
    return res.send({ status: 500, ...e });
}

/**
 * 
 * @param {Response} res Inject the response body
 * @param {Error} e Provide the error message.
 * @param {String?} path (Optional) Path to error template. Default 'partials/error'
 */
const renderUiError = (res, e, path) => {
    console.log(e);
    let message = '';
    if (e.allErrors) {
        e.allErrors.forEach(error => message += error.message + '<br />');
    }
    else {
        message = e.message || JSON.stringify(e);
    }
    res.render(path || 'partials/error', { message, layout: false });
}

const mapUserToFF5 = (users, ff5) => {
    let results = users.map(u => {
        let f = ffs.filter(ff => Number(ff.id) === u.id);
        if (f && f.length > 0) {
            let dates = f[0].ff_dates.dates;
            dates.forEach(d => {
                u.addFF5(d);
            });
        }
        return u;
    });
    return results;
}

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

    ////////////////////////////////////
    // UI Endpoints
    app.post('/api/ui/ff5', (req, res) => {
        try {
            let users = req.body.users
                ? req.body.users.map(u => new User(u))
                : [];
            res.render('partials/twitter/dashboard-userlist', {
                title: 'FF5',
                list: users,
                isFF5: users.length > 0,
                footer: 'Add some users!',
                layout: false
            });
        }
        catch (e) {
            renderUiError(res, e);
        }
    });

    app.get('/api/ui/userlist', (req, res) => {
        twitter.getUserList()
            .then(users => {
                Promise.all(users.map(async u => await u.getFF5()))
                    .then(() => {
                        res.render('partials/twitter/dashboard-userlist', {
                            title: 'Ranked Users',
                            footer: 'Reload',
                            list: users,
                            layout: false
                        });
                    });
            })
            .catch(e => renderUiError(res, e));
    });

    app.get('/api/ui/todolist', (req, res) => {
        twitter.getTodoList()
            .then(todos => {
                res.render('partials/twitter/dashboard-simplelist', { layout: false, ...todos });
            })
            .catch(e => renderUiError(e));
    });

    app.get('/api/ui/modalImage', (req, res) => {
        let fromDate = utils.nextFriday(
            req.query.fromDate
                ? moment(req.query.fromDate)
                : moment()
        )
            .format(utils.dateFormats.images);
        knex.images(fromDate)
            .then(images => {
                const image = images[0];
                image.date = moment(image.date).format(utils.dateFormats.ui);
                res.render('partials/modals/tweet-attachment', {
                    image,
                    layout: false
                })
            })
            .catch(e => {
                renderUiError(res, e);
            });
    });

    app.get('/api/ui/modalContent', (req, res) => {
        res.render('partials/modals/global-tweet', { layout: false });
    });

    app.get('/api/ui/profileCard', (req, res) => {
        const layout = {
            success: 'partials/modals/profile-card',
            error: 'partials/modals/profile-card-error'
        };
        twitter.getUser(req.query)
            .then(user => {
                res.render(layout.success, {
                    user,
                    layout: false
                });
            })
            .catch(e => {
                e.allErrors.push({ code: 69, message: `Could not find user. ${JSON.stringify(req.query)}` });
                renderUiError(res, e, layout.error);
            });
    })

    app.get('/api/ui/friTease', (req, res) => {
        friTease(req)
            .then((stream) => {
                Promise.all(stream.map(async s => await s.user.getFF5()))
                    .then(() => {
                        res.render('partials/stream', {
                            stream,
                            count: stream.length,
                            layout: false
                        })
                    });
            })
            .catch(e => renderUiError(res, e));
    });
}

module.exports = {
    init
}
