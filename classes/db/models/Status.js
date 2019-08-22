const KnexModel = require('./KnexModel')
  , User = require('./User')
  , Media = require('./Media');
const table_name = 'statuses';

class Status extends KnexModel {
    constructor(params, mapType) {
        super(table_name, params.id);
        
        switch(mapType) {
          case KnexModel.mapTypes.twitterToStatus:
            this.twitterToStatus(this, params);
            break;
          case KnexModel.mapTypes.dbToStatus:
            this.dbToStatus(this, params);
            break;
        }

        this.user = new User(params.user);
        this.media = new Media(params.extended_tweet) || null;
    }
    
    get id() {
      return this._id;
    }
    set id(val) {
      this._id = val;
    }
    get user_id() {
      return this._user_id;
    }
    get user() {
      return this._user;
    }
    set user(val) {
      this._user = val;
      if (val) {
        this._user_id = val.id;
      }
    }
    get retweet_status() {
      return this._retweeted_status;
    }
    set retweet_status(val) {
      this._retweeted_status = val;
    }
    get retweet_status() {
      return this._retweet_status;
    }
    set retweet_status(val) {
      this._retweet_status = val;
    }
    get reply_status() {
      return this._reply_status;
    }
    set reply_status(val) {
      this._reply_status = val;
    }
    get created_at() {
      return this._created_at;
    }
    set created_at(val) {
      this._created_at = val;
    }
    get text() {
      return this._text;
    }
    set text(val) {
      this._text = val;
    }
    get full_text() {
      return this._full_text;
    }
    set full_text(val) {
      this._full_text = val;
    }
    get quote_count() {
      return this._quote_count;
    }
    set quote_count(val) {
      this._quote_count = val;
    }
    get reply_count() {
      return this._reply_count;
    }
    set reply_count(val) {
      this._reply_count = val;
    }
    get retweet_count() {
      return this._retweet_count;
    }
    set retweet_count(val) {
      this._retweet_count = val;
    }
    get favorite_count() {
      return this._favorite_count;
    }
    set favorite_count(val) {
      this._favorite_count = val;
    }
    get favorited() {
      return this._favorited;
    }
    set favorited(val) {
      this._favorited = val;
    }
    get retweeted() {
      return this._retweeted;
    }
    set retweeted(val) {
      this._retweeted = val;
    }

    toTable() {
      return {
        id: this.id,
        user_id: this.user_id,
        reply_status_id: this.reply_status_id,
        retweet_status_id: this.retweeted_status_id,
        quote_status_id: this.quote_status_id,
        text: this.text ? this.stringToHtml(this.text) : null,
        full_text: this.full_text ? this.stringToHtml(this.full_text) : null,
        quote_count: this.quote_count,
        reply_count: this.reply_count,
        retweet_count: this.retweet_count,
        favorite_count: this.favorite_count,
        favorited: this.favorited,
        retweeted: this.retweeted,
        created_at: this.created_at,
      }
    }

    save() {
       console.log(`Saving (Status)`);
       if (this.user) {
          console.log(`\tDependent User`);
          this._dependents.push(this.user);
       }
       if (this.media) {
         console.log(`\tDependent Media`);
         // URHERE: Undefined binding(s) detected when compiling SELECT query: select * from "media" where "id" = ?
         // this._dependents.push(this.media);
       }
       return super.save();
    }
}

module.exports = Status;
