const config = require('./../config');
var knex = require('knex')(config.knex);

const images = (forDate) => {
    let results = knex
        .select('*')
        .from('ff_images');
    return forDate 
        ? results.where('date', forDate)
        : results.where('id','>',0);
}

const scheduledPosts = (where) => {
    let results = knex
        .select('*')
        .from('ff_posts');
    return where
        ? results.where(where)
        : results;
}

const ffUsers = (where) => {
    let results = knex
            .select('*')
            .from('ff_users');
    return where 
        ? results.where(where)
        : results;
}

knex.on('query', function( queryData ) {
    let sql = queryData.sql;
    queryData.bindings.forEach(b => sql.replace('?',b));
    if (config.knex.debug === true) {
        console.log(sql);
    }
});

module.exports = {
    db: knex,
    ffUsers,
    images,
    scheduledPosts
}