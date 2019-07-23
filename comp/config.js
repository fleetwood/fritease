require('dotenv').config();
const env = process.env;

const knex = {
    "client": "pg",
    "debug": false,
    "connection": {
        "host": env.DB_HOST,
        "database": env.DB,
        "user": env.DB_USER,
        "port": env.DB_PORT,
        "password": env.DB_PW
    },
    "pool": {
        "min": 2,
        "max": 4
    },
    "migrations": {
        "tableName": "knex_migrations"
    }
}

module.exports = {
    port: env.PORT || 8080,
    knex,
    TW_API_KEY: env.TW_API_KEY,
    TW_API_SECRET_KEY: env.TW_API_SECRET_KEY,
    TW_ACCESS_TOKEN: env.TW_ACCESS_TOKEN,
    TW_ACCESS_TOKEN_SECRET: env.TW_ACCESS_TOKEN_SECRET
};