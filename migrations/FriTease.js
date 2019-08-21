const db = require('./../classes/db/DB')
    , models = db.Models
    , tables= db.ModelTables;

exports.up = (knex, Promise) => {
    return Promise.all([

        knex.schema.createTable(tables.Theme, (table) => {
            table.increments();
            table.date('date').unique();
            table.string('url');
            table.string('theme1');
            table.string('theme2');
            table.datetime('created_at');
            table.datetime('updated_at');
        }),

        knex.schema.createTable(tables.Prompt, (table) => {
            table.increments();
            table.bigint('status_id').nullable();
            table.integer('theme_id').nullable();
            table.date('date').unique();
            table.datetime('created_at');
            table.datetime('updated_at');
        }),

    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable(tables.Theme),
        knex.schema.dropTable(tables.Prompt),
    ]);
};
