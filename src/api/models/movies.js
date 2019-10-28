const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  released_on: {
    type: Date,
    trim: true,
    required: true,
  },
})

module.exports = mongoose.model('Movie', MovieSchema)