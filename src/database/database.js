require('dotenv').config();
const config = require('../../config/config');
const { Sequelize } = require('sequelize');

const environment = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(config[environment]);

module.exports = sequelize;