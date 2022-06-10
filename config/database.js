const path = require('path');

module.exports = ({ env }) => {
  return {
    connection: {
      client: 'mysql',
      connection: {
        host: env("DB_HOST"),
        database: env("DB_NAME"),
        user: env("DB_USER"),
        password: env("DB_PASSWORD")
      },
      useNullAsDefault: true,
    },
  }
}
