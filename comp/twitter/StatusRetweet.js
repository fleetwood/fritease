const User = require('./User');
const Status = require('./Status');

class StatusRetweet extends Status {
    constructor(params) {
        super(params);
        this._retweetStatus = new Status(params.retweeted_status);
        this._retweetUser = new User(params.retweeted_status.user);
        this._retweet_id = params.retweeted_status ? params.retweeted_status.id : null;

        this._facepile = null;
    }
    get isRetweet() {
        return true;
    }
    get retweetStatus() {
        return this._retweetStatus;
    }
    get retweetUser() {
        return this._retweetUser;
    }
    get retweetId() {
        return this._retweet_id;
    }
    get facepile() {
        return this._facepile;
    }
    get hasPile() {
        return this._facepile && this._facepile.length>0;
    }
    /**
     * @param {User} user
     */
    addToPile(user) {
        if (this._facepile===null) {
            this._facepile=[];
        }
        if (!this._facepile.find(u => user.id == u.id)) {
            this._facepile.push(user);
            this._retweets+=1;
        }
    }
}

module.exports = StatusRetweet;
