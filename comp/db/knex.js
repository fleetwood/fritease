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

module.exports = {
    images,
    knex,
    ffUsers,
    scheduledPosts
}