const mongoose = require('mongoose')
const Post = require('../../../src/api/models/post')
const User = require('../../../src/api/models/user')

const request = require('supertest')
const app = require('../../../src/server')

async function removeAllUsers() {
  await User.deleteMany({})
}

async function removeAllPosts() {
  await Post.deleteMany({})
}

describe('User Model Integration Test using local mongo db', () => {
  // most of the actions concerning posts require authentication
  // will keep a common token for all tests
  let userId = null
  let userToken = null

  // init mongo db connection
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    // clear table before tests to make sure it does not contain test data
    // TODO: some tests might require seeding of test data?
    await removeAllUsers()
    await removeAllPosts()

    const addUser = await request(app)
      .post('/users/register')
      .send('name=Zed&email=zed@dead.com&password=Password1')

    const authUser = await request(app)
      .post('/users/authenticate')
      .send('email=zed@dead.com&password=Password1')

    userId = mongoose.Types.ObjectId(authUser.body.data.user.id)
    userToken = authUser.body.data.user.token
  })

  // cleanup: clear users table after each test
  afterEach(async () => {
    await removeAllPosts()
  })

  // cleanup: close mongo connection after all tests are run
  afterAll(async () => {
    await Post.deleteMany({})
    await User.deleteMany({})

    await mongoose.connection.close()
  })

  it('Should save new post to database that belongs to current user', async done => {
    const res = await request(app)
      .post('/posts')
      .set('x-access-token', userToken)
      .send('caption=TestCaption&body=TestBody')

    expect(res.statusCode).toEqual(200)

    const post = await Post.findOne({
      caption: 'TestCaption',
    })

    expect(post.caption).toBe('TestCaption')
    expect(post.body).toBe('TestBody')
    expect(post.author).toEqual(userId)

    done()
  })

  it('Should not update selected post in the database if it belongs to another user', async done => {
    const insert = await request(app)
      .post('/posts')
      .set('x-access-token', userToken)
      .send('caption=TestCaption&body=TestBody')

    expect(insert.statusCode).toEqual(200)

    const postId = insert.body.data._id

    const update = await request(app)
      .put(`/posts/${postId}`)
      .set('x-access-token', userToken)
      .send('caption=UpdatedCaption&body=UpdatedBody')

    expect(update.statusCode).toEqual(200)

    const post = await Post.findOne({
      _id: postId
    })

    expect(post.caption).toBe('UpdatedCaption')
    expect(post.body).toBe('UpdatedBody')  

    done()
  })

  it('Should update selected post in the database if it belongs to current user', async done => {
    const insert = await request(app)
      .post('/posts')
      .set('x-access-token', userToken)
      .send('caption=TestCaption&body=TestBody')

    expect(insert.statusCode).toEqual(200)

    const postId = insert.body.data._id

    // simulate another user by sending random access token
    const update = await request(app)
      .put(`/posts/${postId}`)
      .set('x-access-token', 123456789)
      .send('caption=UpdatedCaption&body=UpdatedBody')

    expect(update.statusCode).toEqual(200)
    expect(update.body.status).toEqual('error')
    expect(update.body.message).toEqual('access error')

    done()
  })

  it('Should delete selected post from the database if it belongs to current user', async done => {
    const insert = await request(app)
      .post('/posts')
      .set('x-access-token', userToken)
      .send('caption=TestCaption&body=TestBody')

    expect(insert.statusCode).toEqual(200)

    const postId = insert.body.data._id

    const update = await request(app)
      .delete(`/posts/${postId}`)
      .set('x-access-token', userToken)

    expect(update.statusCode).toEqual(200)
    expect(update.body.status).toEqual('success')
    expect(update.body.message).toEqual('post deleted successfully')

    done()
  })

  it('Should not delete selected post from the database if it belongs to another user', async done => {
    const insert = await request(app)
      .post('/posts')
      .set('x-access-token', userToken)
      .send('caption=TestCaption&body=TestBody')

    expect(insert.statusCode).toEqual(200)

    const postId = insert.body.data._id

    // simulate another user by sending random access token
    const update = await request(app)
      .delete(`/posts/${postId}`)
      .set('x-access-token', 123456789)

    expect(update.statusCode).toEqual(200)
    expect(update.body.status).toEqual('error')
    expect(update.body.message).toEqual('access error')

    done()
  })
})
