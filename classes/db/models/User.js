const bookshelf = require('./Bookshelf')
    , Models = bookshelf.Models
    , Tables = bookshelf.Tables;

const user = bookshelf.model(Models.User, {
    tableName: Tables.User,
    statuses: () => {
        this.hasMany(Models.Status)
    }
});

module.exports = {
    user
};
