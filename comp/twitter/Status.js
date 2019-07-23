const utils = require('./../utils');
const User = require('./User');

class Status {
    constructor(params) {
        const ext = params.extended_tweet;
        this._createDate = utils.formatTwitterDate(params.created_at);
        this._id = utils.asNum(params.id);
        
        this._text = Status.getFullText(ext, params.text);
        if (ext && ext.entities.media) {
            this._media = Status.getMedia(ext.entities);
            this._mediaType = Status.getMediaType(ext.entities);
        }

        this._quotes = utils.asNum(params.quote_count);
        this._replies = utils.asNum(params.reply_count);
        this._retweets = utils.asNum(params.retweet_count);
        this._likes = utils.asNum(params.favorite_count);
        
        this._favorited = params.favorited || false;
        this._retweeted = params.retweeted || false;
        
        this._user = params.user ? new User(params.user) : {};
    }
    
    static getMedia(entities) {
        return entities && entities.media
            ? entities.media[0].media_url
            : null;
    }
    static getMediaType(entities) {
        return entities && entities.media
            ? entities.media[0].type
            : null;
    }
    static getFullText(ext, text) {
        return (ext && ext.full_text) 
            ? ext.full_text
            : text;
    }

    get user() {
        return this._user || {};
    }

    get createDate() {
     return this._createDate || new Date();
    }
    get id() {
        return utils.asNum(this._id);
    }
    get isReply() {
        return this._isReply;
    }

    get media() {
        return this._media;
    }
    get mediaType() {
        return this._mediaType;
    }
    get text() {
        return this._text.toHtmlBr();
    }
    
    get retweets() {
        return utils.asNum(this._retweets);
    }
    get likes() {
        return utils.asNum(this._likes);
    }
    get favorited() {
        return this._favorited || false;
    }
    get retweeted() {
        return this._retweeted || false;
    }
}

module.exports = Status;
