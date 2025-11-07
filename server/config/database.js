const { Sequelize } = require('sequelize');

// You should replace these with environment variables in production
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/basic_web_app', {
    dialect: 'postgres',
    logging: console.log, // set to false to disable SQL logging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;