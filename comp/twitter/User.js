const utils = require('./../utils');
const knex = require('./../db/knex');

class User {
    constructor(data) {
        this.data = data;
        this._id = data.id || -1;
        this._name = data.name || '';
        this._screen_name = data.screen_name || '';
        this._description = data.description || '';
        this._followers = data.followers_count;
        this._friends = utils.asNum(data.friends_count);
        this._liked = utils.asNum(data.favourites_count);
        this._tweets = utils.asNum(data.statuses_count);
        this._profile_image = data.profile_image_url || '';
        this._profile_image_https = data.profile_image_url_https || '';
        this._profile_banner = data.profile_banner_url || '';
        this._follows = data.following || false;
        this._ff5 = [];
        this._rank = 0;
    }

    get id() {
        return this._id || -1;
    }

    get name() {
        return this._name || '';
    }

    get screenName() {
        return this._screen_name || '';
    }

    get description() {
        return this._description || '';
    }

    get followers() {
        return this._followers || -1;
    }
    
    get friends() {
        return this._friends || -1;
    }

    get liked() {
        return this._liked || -1;
    }

    get tweets() {
        return this._tweets;
    }

    /**
     * @returns {<Object>} Formatted user stats
     * @property {String} followers
     * @property {String} friends 
     * @property {String} liked 
     * @property {String} tweets 
     * @see <cref:utils.twitterFormat>
     */
    get ui() {
        return {
            followers: this.followers.twitterFormat(),
            friends: this.friends.twitterFormat(),
            liked: this.liked.twitterFormat(),
            tweets: this.tweets.twitterFormat()
        }
    }
    
    get profileImage() {
        return this._profile_image || '';
    }

    get profileImageHttps() {
        return this._profile_image_https || '';
    }

    get profileBanner() {
        return this._profile_banner;
    }

    get follows() {
        return this._follows || false;
    }

    get isFF() {
        return this._ff5.length>0;
    }

    get ff5() {
        return this._ff5;
    }

    get rank() {
        let rank = this._rank;
        if (this.followers>0) rank += Math.floor(this.followers/1000);
        if (this.tweets>0) rank += Math.floor(this.tweets/1000);
        return rank;
    }

    addRank(val) {
        this._rank += val;
    }

    addFF5(date) {
        if (Array.isArray(date)) {
            this._ff5 = this._ff5.concat(date);
        }
        else if (!this._ff5.find(f => f === date)) {
            this._ff5.push(date);
        }
    }

    getFF5() {
        return new Promise((resolve, reject) => {
            knex.ffUsers({'id':this._id})
                .then(u => {
                    if(u && u.length > 0) {
                        this.addFF5(u[0].ff_dates.dates);
                    }
                    resolve();
                })
                .catch(e => reject(e));
            });
    }

    save() {
        // TODO: write to db
    }
}

module.exports = User;
