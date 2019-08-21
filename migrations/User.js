const db = require('./../classes/db/DB')
    , models = db.Models
    , tables= db.ModelTables;

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable(tables.User, (table) => {
            table.bigint('id').primary();
            table.string('name').notNullable();
            table.string('screen_name').notNullable();
            table.string('url');
            table.text('description');
            table.integer('followers_count');
            table.integer('friends_count');
            table.integer('listed_count');
            table.integer('favourites_count');
            table.integer('statuses_count');
            table.string('profile_background_image_url');
            table.string('profile_background_image_url_https');
            table.string('profile_image_url');
            table.string('profile_image_url_https');
            table.string('profile_banner_url');
            table.boolean('following').defaultTo(false);
            table.datetime('created_at');
            table.datetime('updated_at');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable(tables.User)
    ]);
};