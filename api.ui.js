
////////////////////////////////////
// REQUIRES
const utils = require('./comp/utils')
    , path = utils.path
    , fs = utils.fs
    , moment = utils.moment
    , knex = require('./comp/db/knex')
    , twitter = require('./comp/twitter')
    , User = require('./comp/twitter/User')
    , renderError = require('./comp/utils.rendering').renderError
    , renderUiError = require('./comp/utils.rendering').renderUiError;

const friTease = (req, cache) => twitter.friTease({ friTease: true, ...req.query, cache});

////////////////////////////////////
// UI Endpoints
const init = (app, cache) => {

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

    app.get('/api/ui/todolist', cache.route('/api/ui/todolist'), (req, res) => {
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

    app.get('/api/ui/friTease', cache.route('/api/ui/friTease'), (req, res) => {
        friTease(req, cache)
            .then((stream) => {
                Promise.all(stream.results.map(async s => await s.user.getFF5()))
                    .then(() => {
                        res.render('partials/stream', {
                            stream: stream.results,
                            next: stream.next,
                            showNext: stream.next ? true : false,
                            count: stream.results.length,
                            layout: false
                        })
                    });
            })
            .catch(e => renderUiError(res, e));
    });
    
};

module.exports = {
    init
};