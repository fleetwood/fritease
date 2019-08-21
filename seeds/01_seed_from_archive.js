const bookshelf = require('./../classes/db/models/Bookshelf')
    , Bookshelf = bookshelf.bookshelf
    , Models = bookshelf.db.Models
    , Tables = bookshelf.db.ModelTables;

    const Status = Bookshelf.Model.extend({
        tableName: Tables.Status,
        hasTimestamps: true,

        user() {
            return this.hasOne(User, 'id')
        }
    });
    const Statuses = Bookshelf.Collection.extend({
        model: Status
    });

    const User = Bookshelf.Model.extend({
        tableName: Tables.User,
        hasTimestamps: true,

        status() {
            return this.belongsTo(Status, 'id');
        }
    });

    const Users = Bookshelf.Collection.extend({
        model: User
    });
        

const data = require('./../classes/mocks/twitter.searchTweets.json');

// exports.seed = function(knex, Promise) {

const seed = async() => {
    await     data.results.map(async s => {
        await Status.forge()
            .save({
                id: s.id,
                user_id: s.user.id,
                reply_status_id: s.reply_status_id,
                retweet_status_id: s.retweet_status_id,
                quote_status_id: s.quote_status_id,
                text: s.text,
                full_text: s.full_text,
                quote_count: s.quote_count,
                reply_count: s.reply_count,
                retweet_count: s.retweet_count,
                favorite_count: s.favorite_count,
                favorited: s.favorited,
                retweeted: s.retweeted,
                created_at: s.created_at
            })
            .then(result => {
                console.log(`Saved new status: ${result.get('id')}`);
                let u = s.user;
                User.forge()
                    .save({
                        id: u.id,
                        name: u.name,
                        screen_name: u.screen_name,
                        url: u.url,
                        description: u.description,
                        followers_count: u.followers_count,
                        friends_count: u.friends_count,
                        listed_count: u.listed_count,
                        favourites_count: u.favourites_count,
                        statuses_count: u.statuses_count,
                        profile_background_image_url: u.profile_background_image_url,
                        profile_background_image_url_https: u.profile_background_image_url_https,
                        profile_image_url: u.profile_image_url,
                        profile_image_url_https: u.profile_image_url_https,
                        profile_banner_url: u.profile_banner_url,
                        following: u.following,
                        created_at: u.created_at
                    })
                    .then(user => {
                        console.log(`Saved new user: ${u.screen_name}`);
                        return {result, user};
                    })
                    .catch(e => {
                        console.log(`Failed saving user.\n\t${e.message}`);
                        return e;
                    });
            })
            .catch(e => {
                console.log(`Failed saving status: ${e.message}`);
                return e;
            });
        });
}

const select = async () => {
    await Status
        .forge()
        .fetchAll()
        .then(results => {
            console.log(`All done!`);
            results.forEach(r => {
                console.log(`${r.id}: ${r.user.screen_name}`);
            })
        })
        .catch(e => {
            console.log(`Failed Promise.all: ${e.message}`);
        });
}

select();
// };