const config = require('../config');
const knex = require('knex')(config.knex);
const Media = require('./models/Media'),
    Prompt = require('./models/Prompt'),
    Status = require('./models/Status'),
    Theme = require('./models/Theme'),
    User = require('./models/User');

const saveScheduledPrompt = (params) => new Promise((resolve, reject) => {
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

knex.on('query', function( queryData ) {
    let sql = queryData.sql;
    queryData.bindings.forEach(b => sql.replace('?',b));
    if (config.knex.debug === true) {
        console.log(sql);
    }
});

module.exports = {
    knex,
    Models: {
        Media,
        Prompt,
        Status,
        Theme,
        User       
    }
}