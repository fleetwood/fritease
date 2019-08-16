const prompts = 'fritease_prompts'
    , users = 'fritease_users'
    , themes = 'fritease_themes';

exports.up = (knex, Promise) => {
    return Promise.all([

        knex.schema.createTable(themes, (table) => {
            table.increments('id').primary();
            table.date('date').unique();
            table.string('url');
            table.string('theme1');
            table.string('theme2');
        }),

        knex.schema.createTable(prompts, (table) => {
            table.increments('id').primary();
            table.bigint('status_id').unique().nullable();
            table.date('date').unique();
        }),

        knex.schema.createTable(users, (table) => {
            table.bigint('user_id');
            table.bigint('prompt_id');
            table.date('date');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable(themes),
        knex.schema.dropTable(prompts),
        knex.schema.dropTable(users)
    ]);
};
