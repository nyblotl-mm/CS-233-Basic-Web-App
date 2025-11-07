const Recipe = require('./Recipe');
const Restaurant = require('./Restaurant');
const GumBrand = require('./GumBrand');
const sequelize = require('../config/database');

module.exports = {
    Recipe,
    Restaurant,
    GumBrand,
    sequelize
};