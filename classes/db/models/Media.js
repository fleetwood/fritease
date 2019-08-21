const bookshelf = require('./Bookshelf')
    , Models = bookshelf.Models
    , Tables = bookshelf.Tables;

const media = bookshelf.model(Models.Media, {
    tableName: Tables.Media,
    status: () => {
        this.belongsTo(Models.Status);
    }
});

module.exports = {
    media
}