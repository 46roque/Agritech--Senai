const {Pool} = require('pg')
require('dotenv').config();


const BD = new Pool ({
    connectionString: process.env.DATABASE_URL
    // user: 'postgres',
    // host: 'localhost',
    // database: 'projeto',
    // password: 'admin',
    // port: 5432,
})

module.exports = BD