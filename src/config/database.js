module.exports = {
  // add localhost fallbacks
  url: process.env.PROD_MONGODB || 'mongodb://127.0.0.1:27017',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
}
