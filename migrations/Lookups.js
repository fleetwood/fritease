const statusToMedia = 'fk_status_to_media'
    , statusToUser = 'fk_status_to_user'
    , userToFF5 = 'fk_user_to_ff5';

exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable(statusToMedia, (table) => {
            table.bigint('status_id').notNullable();
            table.bigint('media_id').notNullable();
        }),
        
        knex.schema.createTable(statusToUser, (table) => {
            table.bigint('status_id').notNullable();
            table.bigint('user_id').notNullable();
        }),
        
        knex.schema.createTable(userToFF5, (table) => {
            table.bigint('user_id').notNullable();
            table.bigint('status_id').notNullable();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable(statusToMedia),
        knex.schema.dropTable(statusToUser),
        knex.schema.dropTable(userToFF5)
    ]);
};
