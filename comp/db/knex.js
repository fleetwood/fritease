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

const saveScheduledPrompt = (params) => new Promise((resolve, reject) => {
    // params = {
    //     image: req.query.imageUrl,
    //     statustext: req.query.statusText,
    //     ff5_users: req.query.ff5_users,
    //     date: req.query.date
    // };
    const insert = knex('ff_posts')
        .insert(params)
        .toString();
    const update = knex('ff_posts')
        .update(params)
        .whereRaw(`ff_posts.date = ?`, [params.date])
        .toString();
    const query = `${insert} 
        ON CONFLICT (date) 
        DO UPDATE 
        SET ${update.replace(/^update\s.*\sset\s/i, '')}`;

    knex.raw(query)
        .then(res => resolve(res))
        .catch(e => reject(e));
});

const ffUsers = (where) => {
    let results = knex
            .select('*')
            .from('ff_users');
    return where 
        ? results.where(where)
        : results;
}

/**
 * Iterates through all users in the list, and upserts in the db with the new FF5 date
 * @param {Array<User>} userList A collection of to update in database
 * @see ./comp/twitter/User
 */
const updateFF5_Users = (userList) => new Promise((resolve, reject) => {
   resolve()
   reject()
});

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
    saveScheduledPrompt,
    scheduledPosts,
    updateFF5_Users
}