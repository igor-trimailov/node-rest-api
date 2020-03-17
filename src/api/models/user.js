/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the user, needs to be unique
 *          email:
 *            type: string
 *            format: email
 *            description: Email of the user needs to be unique. Used as a login.
 *          password:
 *            type: string
 *            description: Password of the user
 *          created_on:
 *            type: string
 *            format: datetime
 *            description: Date when the user was added to the system.
 *          example:
 *            name: Zed
 *            email: zed@dead.com
 *            password: Password1
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

// define schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  recoveryToken: {
    type: String,
  },
  recoveryTokenExp: {
    type: String,
  },
  created_on: Date,
})

// hash user password before saving it into database
UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds)
  next()
})

// validate email
UserSchema.path('email').validate(function(email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return emailRegex.test(email)
}, 'The e-mail needs to be real')

// validate password
UserSchema.path('password').validate(function(password) {
  return password !== 'Password1'
}, 'The password cannot be stupid')

module.exports = mongoose.model('User', UserSchema)
