const mongoose = require('mongoose')
const { databaseConfig } = require('./config')

mongoose.connect(databaseConfig.url, databaseConfig.options)

mongoose.Promise = global.Promise

module.exports = mongoose
