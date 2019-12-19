const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  create: function(req, res, next) {
    userModel.create(
      {
        ...req.body,
        posted_on: new Date(),
      },
      function(err) {
        if (err) {
          if (err.code === 11000) {
            return res.status(422).send({
              status: 'error',
              message: 'duplicate user',
              data: err.keyValue
            })
          } else {
            next(err)
          }
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
            { expiresIn: '1h' }
          )

          res.json({
            status: 'success',
            message: 'user found',
            data: {
              user: {
                id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                token: token,
              },
            },
          })
        } else {
          res.json({
            status: 'error',
            message: 'invalid email/password',
            data: null,
          })
        }
      }
    })
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
