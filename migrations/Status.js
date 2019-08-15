knex.schema.createTable('statuses', function(table){
    table.bigint('id').primary();
    table.bigint("user");
    table.datetime("created_at");
    //entities: FK: table.bigint("media");
    table.bigint("retweeted_status");
    table.string('text');
    table.string('full_text');
    table.string('in_reply_to_status_id');
    table.string('in_reply_to_user_id');
    table.string('"in_reply_to_screen_name');
    table.int("quote_count");
    table.int("reply_count");
    table.int("retweet_count");
    table.int("favorite_count");
    table.boolean("is_quote_status").defaultTo(false);
    table.boolean("favorited").defaultTo(false);
    table.boolean("retweeted").defaultTo(false);
});