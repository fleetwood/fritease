exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('ff_users', function(table) {
            table.bigint('id').primary();
            table.string('name');
            table.string('screen_name');
            table.boolean('follows');
            table.integer('tweets');
            table.integer('followers');
            table.integer('friends');
            table.string('likes');
            table.string('description');
            table.string('profile_image');
            table.string('profile_banner');
            table.integer('ft_retweets');
            table.integer('ft_tweets');
            table.jsonb('ff_dates');
            table.timestamps();
        }),

        knex.schema.createTable('ff_images', function(table){
            table.increments('id').primary();
            table.string('url');
            table.date('date');
            table.string('theme1');
            table.string('theme2');
            table.timestamps();
        }),

        knex.schema.createTable('ff_posts', function(table){
            table.increments('id').primary();
            table.date('date');
            table.string('image');
            table.string('statustext');
            table.boolean('complete');
            table.boolean('notified');
            table.string('url');
            table.timestamps();
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('ff_users'),
        knex.schema.dropTable('ff_images'),
        knex.schema.dropTable('ff_posts')
    ]);
};
