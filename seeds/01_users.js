const ff_users = require('./ff_users.json');

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    let users = ff_users.map(u => {
        return {
            id: u.id,
            name: u.name,
            screen_name: u.screen_name,
            follows: u.follows,
            tweets: u.statuses_count || u.tweets || 0,
            followers: u.followers_count || u.followers || 0,
            friends: u.friends_count,
            likes: u.favourites_count,
            description: u.description,
            profile_image: u.profile_image_url,
            profile_banner: u.profile_background_image_url,
            ft_retweets: 0,
            ft_tweets: 0,
            ff_dates: u.ff_dates || { dates: [] }
        }
    });
    users.forEach(u => `Inserting ${u.screen_name}`);
    return knex('ff_users').insert(users);
};
