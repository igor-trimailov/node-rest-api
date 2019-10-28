const mongoose = require('mongoose')
const mongoDB = PROD_MONGODB

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise

module.exports = mongoose
