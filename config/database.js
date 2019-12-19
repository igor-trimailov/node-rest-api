const mongoose = require('mongoose')
const url = process.env.PROD_MONGODB
// figgure out a better switch between environments
// const url = 'mongodb://127.0.0.1:27017'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
mongoose.Promise = global.Promise

module.exports = mongoose
