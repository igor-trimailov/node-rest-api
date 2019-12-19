const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  posted_on: {
    type: Date,
    required: false,
  },
  edited_on: {
    type: Date,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

module.exports = mongoose.model('Post', PostSchema)
