const config = require('./../config');
var knex = require('knex')(config.knex);
var User = require('./../../comp/twitter/User');

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
 * @param {moment} date The date that the user was FF5'ed
 * @see ./comp/twitter/User
 */
const updateFF5_Users = (userList, date) => new Promise((resolve, reject) => {
    let findUsers = userList.map(u => u.id);
    knex('ff_users')
        .select('*')
        .whereIn('id', findUsers)
        .then(existingUsers => {
            if (existingUsers.length > 0) {
                existingUsers = existingUsers.map(e => new User(e));
                userList.forEach(u => {
                    // find existing users and add their ff5 to userList, since 
                    // we're going to overwrite the db entry, bc new counts n shits
                    let eu = existingUsers.find(f => f.screen_name === u.screen_name);
                    if (eu) {
                        u.addFF5(eu.ff5);
                    }
                });
            }
            userList.forEach(async u => {
                u.addFF5(date.format('YYYY-MM-DD'));
                await u.save()
                    .then(result => console.log(`SAVED ${u.screenName}`))
                    .catch(e => console.error(`ERROR saving ${u.screenName}:\n${JSON.stringify(e)}`));
            });
        })
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