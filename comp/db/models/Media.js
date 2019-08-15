const KnexModel = require('./KnexModel');
const table_name = 'media';

class Media extends KnexModel {
    /**
     * Used to store images and video in Statuses.
     * @param {bigint} params.id The twitter integer provided when the media item was chunked
     * @param {bigint} params.status_id Reference to the status that the media item belongs to.
     * @param {datetime} params.created_at The date time that the status was created
     * @param {bigint} params.retweeted_status TODO: what is this used for?
     * @param {string} params.media_url Media url 
     * @param {string} params.media_url_https SSL media url
     * @param {string} params.url More url, idk
     * @param {string} params.display_url Url for the prompt maybe?
     * @param {string} params.expanded_url This may be useful for truncated statuses
     * @param {String<Media.Types>} params.type Enum for the different possible media types
     */
    constructor(params) {
        super(table_name);
        this.addProps([
            { k: `id`, pk: true},
            { k: `status_id`},
            { k: `created_at`},
            { k: `retweeted_status`},
            { k: `media_url`},
            { k: `video_url`},
            // TODO: This is prolly not going to work
            // { k: `video_url`, v: 'video_info.variants[0].url'},
            { k: `media_url_https`},
            { k: `url`},
            { k: `display_url`},
            { k: `expanded_url`},
            { k: `type`},
            { k: `sizes`}
        ], params);
    }

    /**
     * Enum for various media types
     * @property {string} animated_gif
     * @property {string} photo
     * @property {string} video
     */
    static get Types() {
        return {
            animated_gif: 'animated_gif',
            photo: 'photo',
            video: 'video'
        };
    }

    /**
     * PROPERTIES
    */
   get id() {
       return this._id;
   }
   set id(val) {
       this._id = val;
   }

   get status() {
     return this._status;
   }
   set status(val) {
     this._status = val;
   }

   get created_at() {
     return this._created_at;
   }
   set created_at(val) {
     this._created_at = val;
   }

   get retweeted_status() {
     return this._retweeted_status;
   }
   set retweeted_status(val) {
     this._retweeted_status = val;
   }

   get media_url() {
     return this._media_url;
   }
   set media_url(val) {
     this._media_url = val;
   }

   get media_url_https() {
     return this._media_url_https;
   }
   set media_url_https(val) {
     this._media_url_https = val;
   }

   get url() {
     return this._url;
   }
   set url(val) {
     this._url = val;
   }

   get display_url() {
     return this._display_url;
   }
   set display_url(val) {
     this._display_url = val;
   }

   get expanded_url() {
     return this._expanded_url;
   }
   set expanded_url(val) {
     this._expanded_url = val;
   }

   get type() {
     return this._type;
   }
   set type(val) {
     this._type = val;
   }

   get sizes() {
     return this._sizes;
   }
   set sizes(val) {
     this._sizes = val;
   }
}

module.exports = Media;