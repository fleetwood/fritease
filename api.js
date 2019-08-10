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
                const sampleResult = {
                    "created_at": "Fri Aug 09 03:42:24 +0000 2019",
                    "id": 1159671244310098000,
                    "id_str": "1159671244310097920",
                    "text": "#FriTease 08/09\nTHEME 1: \"IGNORE\"\nTHEME 2: \"YEARN\"\n\n#FF 5 peeps to follow 👁👁:\n@S_Massey\n@cheriesummers18… https://t.co/LGAjXIwmQ6",
                    "truncated": true,
                    "entities": {
                        "hashtags": [
                            {
                                "text": "FriTease",
                                "indices": [
                                    0,
                                    9
                                ]
                            },
                            {
                                "text": "FF",
                                "indices": [
                                    52,
                                    55
                                ]
                            }
                        ],
                        "symbols": [],
                        "user_mentions": [
                            {
                                "screen_name": "S_Massey",
                                "name": "Shannon",
                                "id": 31247527,
                                "id_str": "31247527",
                                "indices": [
                                    78,
                                    87
                                ]
                            },
                            {
                                "screen_name": "cheriesummers18",
                                "name": "Cherié Summers",
                                "id": 3413483375,
                                "id_str": "3413483375",
                                "indices": [
                                    88,
                                    104
                                ]
                            }
                        ],
                        "urls": [
                            {
                                "url": "https://t.co/LGAjXIwmQ6",
                                "expanded_url": "https://twitter.com/i/web/status/1159671244310097920",
                                "display_url": "twitter.com/i/web/status/1…",
                                "indices": [
                                    106,
                                    129
                                ]
                            }
                        ]
                    },
                    "source": "<a href=\"https://fritease.herokuapp.com/\" rel=\"nofollow\">fritease</a>",
                    "in_reply_to_status_id": null,
                    "in_reply_to_status_id_str": null,
                    "in_reply_to_user_id": null,
                    "in_reply_to_user_id_str": null,
                    "in_reply_to_screen_name": null,
                    "user": {
                        "id": 805852551090470900,
                        "id_str": "805852551090470914",
                        "name": "John Pendleton 🌹",
                        "screen_name": "johnfpendleton",
                        "location": "Chicago, IL",
                        "description": "Super-Married ❤️ \nAdmin #FriTease 😘\nMale POV intellectual feminist erotica. cis/het/mono/he/him, #metoo/LGBTQ+/ally 21+",
                        "url": "https://t.co/x3umAziMEk",
                        "entities": {
                            "url": {
                                "urls": [
                                    {
                                        "url": "https://t.co/x3umAziMEk",
                                        "expanded_url": "https://www.facebook.com/JohnFPendleton/",
                                        "display_url": "facebook.com/JohnFPendleton/",
                                        "indices": [
                                            0,
                                            23
                                        ]
                                    }
                                ]
                            },
                            "description": {
                                "urls": []
                            }
                        },
                        "protected": false,
                        "followers_count": 1212,
                        "friends_count": 1015,
                        "listed_count": 23,
                        "created_at": "Mon Dec 05 19:13:15 +0000 2016",
                        "favourites_count": 7824,
                        "utc_offset": null,
                        "time_zone": null,
                        "geo_enabled": false,
                        "verified": false,
                        "statuses_count": 5809,
                        "lang": null,
                        "contributors_enabled": false,
                        "is_translator": false,
                        "is_translation_enabled": false,
                        "profile_background_color": "000000",
                        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
                        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
                        "profile_background_tile": false,
                        "profile_image_url": "http://pbs.twimg.com/profile_images/1129065277633781760/gMIz7IPd_normal.jpg",
                        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1129065277633781760/gMIz7IPd_normal.jpg",
                        "profile_banner_url": "https://pbs.twimg.com/profile_banners/805852551090470914/1514488556",
                        "profile_link_color": "001111",
                        "profile_sidebar_border_color": "000000",
                        "profile_sidebar_fill_color": "000000",
                        "profile_text_color": "000000",
                        "profile_use_background_image": false,
                        "has_extended_profile": true,
                        "default_profile": false,
                        "default_profile_image": false,
                        "following": false,
                        "follow_request_sent": false,
                        "notifications": false,
                        "translator_type": "none"
                    },
                    "geo": null,
                    "coordinates": null,
                    "place": null,
                    "contributors": null,
                    "is_quote_status": false,
                    "retweet_count": 0,
                    "favorite_count": 0,
                    "favorited": false,
                    "retweeted": false,
                    "possibly_sensitive": false,
                    "lang": "en"
                };
                res.send({
                    status: 200,
                    data: `http://twitter.com/johnfpendleton/status/${result.id}`
                });
            })
            .catch(e => {
                res.send({
                    status: 500,
                    error: e.allErrors || e.message || e.stack || e
                });
            });
    });

    // TODO: save to db
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
