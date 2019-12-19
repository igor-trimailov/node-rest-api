const mongoose = require('mongoose')
// const ObjectId = require('mongoose')
const PostModel = require('../../../src/api/models/post')

const mockDate = new Date(2015, 2, 1, 19, 35, 0)
const postData = {
  caption: 'Test Post Caption',
  body: 'Test Post body with more text',
  posted_on: mockDate,
  author: new mongoose.Types.ObjectId(),
}

describe('Post Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true },
      err => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      }
    )
  })

  afterAll(async () => {
    mongoose.disconnect()
  })

  it('successfully add and save a new user', async () => {
    const validPost = new PostModel(postData)
    const savedPost = await validPost.save()

    expect(savedPost._id).toBeDefined()
    expect(savedPost.author).toBeDefined()
    expect(savedPost.caption).toBe(postData.caption)
    expect(savedPost.body).toBe(postData.body)
    expect(savedPost.posted_on).toBe(postData.posted_on)
  })
})
