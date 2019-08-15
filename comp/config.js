require('dotenv').config();
const env = process.env;

const knex = {
    "client": "pg",
    "debug": env.DB_DEBUG && env.DB_DEBUG === true,
    "connection": {
        "host": env.DB_HOST,
        "database": env.DB,
        "user": env.DB_USER,
        "port": env.DB_PORT,
        "password": env.DB_PW,
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
    LIB_TOKEN: env.LIB_TOKEN,
    ME: env.ME,
    TW_API_KEY: env.TW_API_KEY,
    TW_API_SECRET_KEY: env.TW_API_SECRET_KEY,
    TW_ACCESS_TOKEN: env.TW_ACCESS_TOKEN,
    TW_ACCESS_TOKEN_SECRET: env.TW_ACCESS_TOKEN_SECRET,
    TW_BEARER_TOKEN: env.TW_BEARER_TOKEN
};