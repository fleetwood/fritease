const db = require('./../classes/db/DB')
    , models = db.Models
    , tables= db.ModelTables;

const StatusUserView = `
CREATE VIEW Statuses_Users AS
  SELECT s.*
    , u.name user_name
    , u.screen_name user_screen_name
    , u.url user_url
    , u.description user_description
    , u.followers_count user_followers_count
    , u.friends_count user_friends_count
    , u.listed_count user_listed_count
    , u.favourites_count user_favourites_count
    , u.statuses_count user_statuses_count
    , u.profile_background_image_url user_profile_background_image_url
    , u.profile_background_image_url_https user_profile_background_image_url_https
    , u.profile_image_url user_profile_image_url
    , u.profile_image_url_https user_profile_image_url_https
    , u.profile_banner_url user_profile_banner_url
    , u.following user_following
    , u.created_at user_created_at
    , u.updated_at user_updated_at
  FROM statuses as s
  INNER join users as u on s.user_id = u.id
`;

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