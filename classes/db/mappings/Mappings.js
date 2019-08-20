module.exports = (KnexModel) => {
    KnexModel.twitterToStatus = (t, params) => {
        t._user_id = params.user.id;

        t._text = params.text;
        t._full_text = params.extended_tweet ? params.extended_tweet.full_text : null;
        t._quote_count = params.quote_count;
        t._reply_count = params.reply_count;
        t._retweet_count = params.retweet_count;
        t._favorite_count = params.favorite_count;
        t._favorited = params.favorited;
        t._retweeted = params.retweeted;
        t._created_at = params.created_at;

        return this;
    };

    KnexModel.dbToStatus = (t, params) => {
        t._id = params.id;
        t._user_id = params.user.id;

        t._text = params.text;
        t._full_text = params.full_text;
        t._quote_count = params.quote_count;
        t._reply_count = params.reply_count;
        t._retweet_count = params.retweet_count;
        t._favorite_count = params.favorite_count;
        t._favorited = params.favorited;
        t._retweeted = params.retweeted;
        t._created_at = params.created_at;

        return this;
    }

    KnexModel.twitterToMedia = (t, params) => {
        t._id = params.id;
        t._display_url = params.display_url;
        t._expanded_url = params.expanded_url;
        t._media_url = params.media_url;
        t._media_url_https = params.media_url_https;
        t._sizes = params.sizes;
        t._type = params.type;
        t._url = params.url;
        t._video_url = params.video_info ? video_info.variants[0].url.video_url : null;

        return this;
    }
}