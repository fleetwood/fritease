const tableName = 'media';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable(tableName, (table) => {
            table.bigint('id').primary();
            table.bigint('status_id').notNullable();
            table.datetime('created_at');
            table.bigint('retweeted_status');
            table.string('media_url');
            table.string('video_url');
            table.string('media_url_https');
            table.string('url');
            table.string('display_url');
            table.string('expanded_url');
            table.string('type');
            table.jsonb('sizes');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable(tableName)
    ]);
};
