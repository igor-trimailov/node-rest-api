// external conf that is never committed to keep your config saferish
const externalConf = require('../../extconf')

module.exports = {
  transportTokenExp: 60 * 60 * 1000,
  email: process.env.TRANSPORT_EMAIL || externalConf.TRANSPORT_EMAIL,
  clientId: process.env.TRANSPORT_CLIENT_ID || externalConf.TRANSPORT_CLIENT_ID,
  clientSecret: process.env.TRANSPORT_CLIENT_SECRET || externalConf.TRANSPORT_CLIENT_SECRET,
  refreshToken: process.env.TRANSPORT_CLIENT_REFRESH_TOKEN || externalConf.TRANSPORT_CLIENT_REFRESH_TOKEN,
  redirectUrl: process.env.TRANSPORT_REDIRECT_URL || externalConf.TRANSPORT_REDIRECT_URL,
}
