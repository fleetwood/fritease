const db = require('./../classes/db/DB')
    , models = db.Models
    , tables= db.ModelTables;

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable(tables.Media, (table) => {
            table.bigint('id').primary();
            table.bigint('status_id');
            table.bigint('retweeted_status_id').nullable();
            table.string('media_url');
            table.string('video_url');
            table.string('media_url_https');
            table.string('url');
            table.string('display_url');
            table.string('expanded_url');
            table.string('type');
            table.jsonb('sizes');
            table.datetime('created_at');
            table.datetime('updated_at');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable(tables.Media)
    ]);
};
