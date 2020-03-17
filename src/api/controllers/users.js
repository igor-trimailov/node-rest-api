const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { appConfig, transportConfig } = require('../../config')
const { isoDateWithOffset } = require('../util')
const {
  sendRecoveryEmail,
  generateRecoveryToken,
} = require('../util/transport')

module.exports = {
  create: function(req, res, next) {
    userModel.create(
      {
        ...req.body,
        posted_on: new Date(),
      },
      function(err) {
        if (err) {
          // handle validation errors
          if (err.name === 'ValidationError') {
            return res.status(422).send({
              status: 'error',
              message: 'Validation error',
              data: {
                message: err.errors[Object.keys(err.errors)[0]].message,
              },
            })
          }

          // duplicate key will reply with mongo error, not validator
          if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(422).send({
              status: 'error',
              message: 'Validation error',
              data: {
                message: 'User name or password already in use',
              },
            })
          }

          next(err)
        } else {
          res.json({
            status: 'success',
            message: 'User added successfully',
          })
        }
      }
    )
  },

  authenticate: function(req, res, next) {
    userModel.findOne({ email: req.body.email }, function(err, userInfo) {
      if (err) {
        next(err)
      } else {
        // user not found
        if (!userInfo) {
          return res.send({
            status: 'error',
            message: 'invalid user',
          })
        }

        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get('secretKey'),
            { expiresIn: '1d' }
          )
          res.json({
            status: 'success',
            message: 'user authenticated',
            data: {
              id: userInfo._id,
              name: userInfo.name,
              token: token,
              expiration: isoDateWithOffset(appConfig.tokenExp),
            },
          })
        } else {
          res.status(401).send({
            status: 'error',
            message: 'invalid credentials',
          })
        }
      }
    })
  },

  refresh: function(req, res, next) {
    // not exactly refresh, will need the consumer to keep track of token
    // expiry date and ask for a new token while the old one is still active
    jwt.verify(
      req.headers['x-access-token'],
      req.app.get('secretKey'),
      function(err, decoded) {
        if (err) {
          res.status(401).send({
            status: 'error',
            message: 'access error',
          })
        } else {
          const token = jwt.sign(
            { id: decoded._id },
            req.app.get('secretKey'),
            { expiresIn: '1d' }
          )

          res.json({
            status: 'success',
            message: 'new token issued',
            data: {
              id: decoded.id,
              newToken: token,
              expiration: isoDateWithOffset(appConfig.tokenExp),
            },
          })
        }
      }
    )
  },

  getAll: function(req, res, next) {
    userModel.find({}, function(err, users) {
      if (err) {
        next(err)
      } else {
        const usersList = users.map(user => {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
          }
        })

        res.json({
          status: 'success',
          message: 'user list found',
          data: { users: usersList },
        })
      }
    })
  },

  // recover is a function that will allow users to reset the forgotten password:
  // - generate token with short lifespan
  // - send token to user as a link: https://domain/reset?token=12345
  // - save token in db
  recover: function(req, res, next) {
    // generate recovery token that is saved in db for later confimration and
    // is sent to user via email as part of recovery link
    const recoveryToken = generateRecoveryToken()

    userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        recoveryToken,
        recoveryTokenExp: isoDateWithOffset(transportConfig.recoveryTokenExp),
      },
      function(err, userInfo) {
        if (err) {
          next(err)
        } else {
          // user not found
          if (!userInfo) {
            return res.send({
              status: 'error',
              message: 'invalid user',
            })
          } else {
            try {
              // try to send out an email
              sendRecoveryEmail(userInfo.email, recoveryToken)

              res.json({
                status: 'success',
                message: 'email sent',
              })
            } catch (e) {
              res.json({
                status: 'error',
                message: 'email not sent',
              })
            }
          }
        }
      }
    )
  },
  // reset is a function that will allow users to reset the forgotten password:
  // - check if user and token are legit and not expired
  // - update password in db
  reset: function(req, res, next) {
    userModel.findOne(
      { email: req.body.email, token: req.body.recoveryToken },
      function(err, userInfo) {
        if (err) {
          next(err)
        } else {
          if (!userInfo) {
            return res.send({
              status: 'error',
              message: 'invalid user',
            })
          } else {
            // check if token is expired
            const expiredToken =
              new Date(userInfo.recoveryTokenExp).toISOString() >
              isoDateWithOffset(-1 * appConfig.tokenExp)

            // token is not expired and there was a user token to being with
            if (!expiredToken && userInfo.recoveryToken) {
              userInfo.password = req.body.password
              userInfo.recoveryToken = null
              userInfo.recoveryTokenExp = null
              userInfo.save()

              res.json({
                status: 'success',
                message: 'password updated',
              })
            } else {
              res.json({
                status: 'error',
                message: 'expired token',
              })
            }
          }
        }
      }
    )
  },
}
