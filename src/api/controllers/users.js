const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const TOKEN_EXP = 1 * 24 * 60 * 60 * 1000

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
                ...err.errors,
              },
            })
          }

          // duplicate key will reply with mongo error, not validator
          if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(422).send({
              status: 'error',
              message: 'duplicate user',
              data: err.keyValue,
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
              user: {
                id: userInfo._id,
                name: userInfo.name,
                token: token,
                expiration: new Date(Date.now() + TOKEN_EXP),
              },
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
              expiration: new Date(Date.now() + TOKEN_EXP),
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
}
