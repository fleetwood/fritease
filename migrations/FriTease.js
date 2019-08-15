exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('fritease_themes', function(table){
            table.increments('id').primary();
            table.string('url');
            table.date('date');
            table.string('theme1');
            table.string('theme2');
        }),

        knex.schema.createTable('fritease_prompts', function(table){
            table.increments('id').primary();
            table.bigint('status_id').unique().nullable();
            table.date('date').unique();
        }),

        knex.schema.createTable('fritease_users', function(table){
            table.bigint('user_id');
            table.bigint('prompt_id');
            table.date('date');
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
