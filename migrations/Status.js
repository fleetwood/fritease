const db = require('./../classes/db/DB')
    , models = db.Models
    , tables= db.ModelTables;

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable(tables.Status, (table) => {
            table.bigint('id').primary();
            table.bigint('user_id');
            table.bigint('reply_status_id');
            table.bigint('retweet_status_id');
            table.bigint('quote_status_id');
            table.text('text');
            table.text('full_text').nullable();
            table.integer('quote_count').defaultTo(0);
            table.integer('reply_count').defaultTo(0);
            table.integer('retweet_count').defaultTo(0);
            table.integer('favorite_count').defaultTo(0);
            table.boolean('favorited').defaultTo(false);
            table.boolean('retweeted').defaultTo(false);
            table.datetime('created_at');
            table.datetime('updated_at');
        }),

        // knex.schema.createTable(lookup_media, (table) => {
        //     table.bigint('status_id'),
        //     table.bigint('media_id')
        // }),

        // knex.schema.createTable(lookup_retweet_users, (table) => {
        //     table.bigint('status_id'),
        //     table.bigint('user_id')
        // })
    ]);
}

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable(tables.Status),
        // knex.schema.dropTable(lookup_media),
        // knex.schema.dropTable(lookup_retweet_users)
    ]);
};