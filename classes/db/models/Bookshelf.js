const db = require('./../DB')
    , bookshelf = require('bookshelf')(db.knex)
    , joi = require('joi')
    , modelBase = require('bookshelf-modelbase')(bookshelf);
bookshelf.plugin(['registry','virtuals']);

module.exports = {
    /**
     * Contains the knex connection as well as Model and Table definitions.
     */
    db,
    /**
     * @property {Bookshelf} bookshelf
     */
    bookshelf,
    joi,
    modelBase
}