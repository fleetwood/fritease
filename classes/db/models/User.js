const KnexModel = require('./KnexModel');
const table_name = 'users';

class User extends KnexModel {
    constructor(params) {
        super(table_name);
        this._id = params.id;
        this._name = params.name;
        this._screen_name = params.screen_name;
        this._created_at = params.created_at;
        this._url = params.url;
        this._description = params.description;
        this._followers_count = params.followers_count;
        this._friends_count = params.friends_count;
        this._listed_count = params.listed_count;
        this._favourites_count = params.favourites_count;
        this._statuses_count = params.statuses_count;
        this._profile_background_image_url = params.profile_background_image_url;
        this._profile_background_image_url_https = params.profile_background_image_url_https;
        this._profile_image_url = params.profile_image_url;
        this._profile_image_url_https = params.profile_image_url_https;
        this._profile_banner_url = params.profile_banner_url;
        this._following = params.following;
    }

    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    get name() {
        return this._name;
    }
    set name(val) {
        this._name = val;
    }
    get screen_name() {
        return this._screen_name;
    }
    set screen_name(val) {
        this._screen_name = val;
    }
    get created_at() {
        return this._created_at;
    }
    set created_at(val) {
        this._created_at = val;
    }
    get url() {
        return this._url;
    }
    set url(val) {
        this._url = val;
    }
    get description() {
        return this._description;
    }
    set description(val) {
        this._description = val;
    }
    get followers_count() {
        return this._followers_count;
    }
    set followers_count(val) {
        this._followers_count = val;
    }
    get friends_count() {
        return this._friends_count;
    }
    set friends_count(val) {
        this._friends_count = val;
    }
    get listed_count() {
        return this._listed_count;
    }
    set listed_count(val) {
        this._listed_count = val;
    }
    get favourites_count() {
        return this._favourites_count;
    }
    set favourites_count(val) {
        this._favourites_count = val;
    }
    get statuses_count() {
        return this._statuses_count;
    }
    set statuses_count(val) {
        this._statuses_count = val;
    }
    get profile_background_image_url() {
        return this._profile_background_image_url;
    }
    set profile_background_image_url(val) {
        this._profile_background_image_url = val;
    }
    get profile_background_image_url_https() {
        return this._profile_background_image_url_https;
    }
    set profile_background_image_url_https(val) {
        this._profile_background_image_url_https = val;
    }
    get profile_image_url() {
        return this._profile_image_url;
    }
    set profile_image_url(val) {
        this._profile_image_url = val;
    }
    get profile_image_url_https() {
        return this._profile_image_url_https;
    }
    set profile_image_url_https(val) {
        this._profile_image_url_https = val;
    }
    get profile_banner_url() {
        return this._profile_banner_url;
    }
    set profile_banner_url(val) {
        this._profile_banner_url = val;
    }
    get following() {
        return this._following;
    }
    set following(val) {
        this._following = val;
    }

    toTable() {
        return {
            id: this.id,
            name: this.name,
            screen_name: this.screen_name,
            created_at: this.created_at,
            url: this.url,
            description: this.stringToHtml(this.description),
            followers_count: this.followers_count,
            friends_count: this.friends_count,
            listed_count: this.listed_count,
            favourites_count: this.favourites_count,
            statuses_count: this.statuses_count,
            profile_background_image_url: this.profile_background_image_url,
            profile_background_image_url_https: this.profile_background_image_url_https,
            profile_image_url: this.profile_image_url,
            profile_image_url_https: this.profile_image_url_https,
            profile_banner_url: this.profile_banner_url,
            following: this.following,
        }
    }
}

module.exports = User;
