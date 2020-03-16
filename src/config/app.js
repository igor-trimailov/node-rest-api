const CLIENT_BASE_URL =
  process.env.APP_CLIENT_BASE_URL || 'http://localhost:3000'

module.exports = {
  tokenExp: 1 * 24 * 60 * 60 * 1000,
  clientBaseUrl: CLIENT_BASE_URL,
  secretKey: process.env.APP_SECRET_KEY || 'super-secret-key',
  corsWhiteList: [
    CLIENT_BASE_URL,
    'http://localhost:5000', // swagger
    undefined, // temporary hack for postman
  ],
}
