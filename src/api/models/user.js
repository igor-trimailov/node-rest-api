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
 *          - created_on
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
  created_on: Date,
})

// hash user password before saving it into database
UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password, saltRounds)
  next()
})

UserSchema.pre('validate', function (next) {
  if (this.password === 'Password1') {
    this.invalidate('password', 'Password is stupid', this.password)
  }
  next();
})

module.exports = mongoose.model('User', UserSchema)
