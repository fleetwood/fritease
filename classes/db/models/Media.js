const KnexModel = require('./KnexModel');
const table_name = 'media';

const twitterParamsForMedia = (params) => {
  if (!params || params === null) {
      return null;
  }
  if (!params[0] || params[0] === null) {
      return null;
  }
  return params[0];
}


class Media extends KnexModel {
  /**
   * Pass params.extended_tweet to find any relevant media. If none found, will return null.
   * @param {bigint} params.id The twitter integer provided when the media item was chunked
   * @param {string} params.media_url Media url 
   * @param {string} params.media_url_https SSL media url
   * @param {string} params.url More url, idk
   * @param {string} params.display_url Url for the prompt maybe?
   * @param {string} params.expanded_url This may be useful for truncated statuses
   * @param {String<Media.Types>} params.type Enum for the different possible media types
   */
  constructor(params) {
    params = twitterParamsForMedia(params);
    super(table_name);
    if (params === null) {
      return undefined;
    }
    else {
      this.twitterToMedia(this, params);
    }
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

  get video_url() {
    return this._video_url;
  }
  set video_url(val) {
    this._video_url = val;
  }

  get sizes() {
    return this._sizes;
  }
  set sizes(val) {
    this._sizes = val;
  }
}

module.exports = Media;
