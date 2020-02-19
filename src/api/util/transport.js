const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const crypto = require('crypto')

const { transportConfig, appConfig } = require('../../config')

// return an instance of oauth client
function getAccessToken() {
  const OAuth2 = google.auth.OAuth2
  const { clientId, clientSecret, refreshToken, redirectUrl } = transportConfig

  oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  })

  return oauth2Client.getAccessToken()
}

// set up smtp transport
function getSmtpTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      ...transportConfig,
      type: 'OAuth2',
      user: transportConfig.email,
      accessToken: getAccessToken(),
    },
  })
}

// general function used to send support emails
function sendSupportMail(to, subject, html) {
  const smtpTransport = getSmtpTransport()
  const options = {
    from: transportConfig.email,
    to,
    subject,
    html,
    generateTextFromHTML: true,
  }

  smtpTransport.sendMail(options, (error, response) => {
    error ? console.log(error) : console.log(response)
    smtpTransport.close()
  })
}

// externalised function that is used to send email with a link to reset password
function sendRecoveryEmail(to, token) {
  const { clientBaseUrl } = appConfig

  const recoveryUrl = `${clientBaseUrl}/password-recovery?token=${token}`

  const body = `
    We've received a request to reset your password. If it was you please follow the link below.
    <p><a href="${recoveryUrl}">${recoveryUrl}</a><p>
    If you did not request a password reset, just ignore this email and continue being awesome.
  `
  const subject = 'BarelyBlog password reset'
  sendSupportMail(to, subject, body)
}

function generateRecoveryToken() {
  return crypto.randomBytes(32).toString('hex')
}

module.exports = { sendRecoveryEmail, generateRecoveryToken }
