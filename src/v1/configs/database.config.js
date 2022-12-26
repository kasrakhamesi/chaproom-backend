require('dotenv').config()

const DATABASE_USERNAME = process.env.DATABASE_USERNAME
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_NAME = process.env.DATABASE_NAME
const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_PORT = parseInt(process.env.DATABASE_PORT)
const DATABASE_DIALECT = process.env.DATABASE_DIALECT

module.exports = {
  development: {
    username: DATABASE_USERNAME || 'root',
    password: DATABASE_PASSWORD || '',
    database: DATABASE_NAME || 'chaproom',
    host: DATABASE_HOST || '127.0.0.1',
    port: DATABASE_PORT || 3306,
    dialect: DATABASE_DIALECT || 'mysql',
    dialectOptions: {
      requestTimeout: 25000
    },
    pool: {
      max: 100,
      min: 0,
      idle: 200000,
      acquire: 1000000
    }
  }
  /*
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      }
    }
  }
  */
}
