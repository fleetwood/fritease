const bookshelf = require('./Bookshelf')
    , Bookshelf = bookshelf.bookshelf
    , Models = bookshelf.db.Models
    , Tables = bookshelf.db.ModelTables;

const Status = Bookshelf.model(Models.Status, {
    hasTimestamps: true,
    tableName: Tables.Status,
    user: () => {
        this.hasOne(Models.User);
    },
    media: () => {
        this.hasMany(Models.Media)
    },
    id: () => {
        return this.get('id');
    },
    name: () => {
       return this.get('name');
    },
    screen_name: () => {
       return this.get('screen_name');
    },
    url: () => {
       return this.get('url');
    },
    description: () => {
       return this.get('description');
    },
    followers_count: () => {
       return this.get('followers_count');
    },
    friends_count: () => {
       return this.get('friends_count');
    },
    listed_count: () => {
       return this.get('listed_count');
    },
    favourites_count: () => {
       return this.get('favourites_count');
    },
    statuses_count: () => {
       return this.get('statuses_count');
    },
    profile_background_image_url: () => {
       return this.get('profile_background_image_url');
    },
    profile_background_image_url_https: () => {
       return this.get('profile_background_image_url_https');
    },
    profile_image_url: () => {
       return this.get('profile_image_url');
    },
    profile_image_url_https: () => {
       return this.get('profile_image_url_https');
    },
    profile_banner_url: () => {
       return this.get('profile_banner_url');
    },
    following: () => {
       return this.get('following');
    },
    created_at: () => {
       return this.get('created_at');
    },
    updated_at: () => {
       return this.get('updated_at');
    },
    dbData: () => {
        return {
            id: this.id,
            name: this.name,
            screen_name: this.screen_name,
            url: this.url,
            description: this.description,
            followers_count: this.followers_count,
            friends_count: this.friends_count,
            listed_count: this.listed_count,
            favourites_count: this.favourites_count,
            statuses_count: this.statuses_count,
            profile_background_image_url: this.profile_background_image_url,
            profile_background_image_url_https: this.profile_background_image_url_https,
            profile_banner_url: this.profile_banner_url,
            profile_image_url: this.profile_image_url,
            profile_image_url_https: this.profile_image_url_https,
            following: this.following,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    },
    save: () => {
        return this.forge(this.dbData).save();
    }
});

const statusRelated = {
    withRelated: ['user', 'media']
};

module.exports = {
    Status: (params) => status.forge(params)
}