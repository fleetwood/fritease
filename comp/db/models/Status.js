const KnexModel = require('./KnexModel');
const table_name = 'statuses';

class Status extends KnexModel {
    constructor(params) {
        super(table_name);
        this.addProps([
            {k: `id`, pk: true},
            {k: `user`, d: true},
            {k: `retweeted_status`, d: true},
            {k: `created_at`},
            {k: `text`},
            {k: `full_text`},
            {k: `in_reply_to_status_id`},
            {k: `in_reply_to_user_id`},
            {k: `in_reply_to_screen_name`},
            {k: `quote_count`},
            {k: `reply_count`},
            {k: `retweet_count`},
            {k: `favorite_count`},
            {k: `is_quote_status`},
            {k: `favorited`},
            {k: `retweeted`}
        ], params);
    }
}

module.exports = Status;
