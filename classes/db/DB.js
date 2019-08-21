const config = require('../config');
const knex = require('knex')(config.knex);

/**
 * Enum for Models
 */
const Models = {
    Media: 'Media',
    Prompt: 'Prompt',
    Status: 'Status' ,
    Theme: 'Theme',
    User: 'User' 
};

/**
 * Names of the model tables in the database
 * @property {String} Media _media_
 * @property {String} Prompt _prompts_
 * @property {String} Status _statuses_
 * @property {String} Theme _themes_
 * @property {String} User _users_
 */
const ModelTables = {
    Media: 'media',
    Prompt: 'prompts',
    Status: 'statuses',
    Theme: 'themes',
    User: 'users'
}

module.exports = {
    knex,
    Models,
    ModelTables
}