const utils = require('../utils');
const User = require('./User');
const Status = require('./Status');

class StatusReply extends Status {
    constructor(params) {
        super(params);
        this._replyToUserId = params.in_reply_to_user_id;
        this._replyToUserName = params.in_reply_to_screen_name;
        this._replyToStatusId = params.in_reply_to_status_id;
    }
    get isReply() {
        return true;
    }
}

module.exports = StatusReply;
