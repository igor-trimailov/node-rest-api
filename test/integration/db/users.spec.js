const mongoose = require('mongoose')
const User = require('../../../src/api/models/user')

const request = require('supertest')
const app = require('../../../src/server')

async function removeAllUsers() {
  await User.deleteMany({})
}

describe('User Model Integration Test using local mongo db', () => {
  // init mongo db connection
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    // clear table before tests to make sure it does not contain test data
    // TODO: some tests might require seeding of test data?
    await User.deleteMany({})
  })

  // cleanup: clear users table after each test
  afterEach(async () => {
    await removeAllUsers()
  })

  // cleanup: close mongo connection after all tests are run
  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('Should save new user to database', async done => {
    const res = await request(app)
      .post('/users/register')
      .send('name=Zed&email=zed@dead.com&password=Password1')

    expect(res.statusCode).toEqual(200)

    const user = await User.findOne({
      name: 'Zed',
    })

    expect(user.name).toBe('Zed')
    expect(user.email).toBe('zed@dead.com')

    done()
  })

  it('Should not save new user to database if the same name already exists', async done => {
    const resFirst = await request(app)
      .post('/users/register')
      .send('name=Zed&email=zed@dead.com&password=Password1')

    expect(resFirst.statusCode).toEqual(200)

    const resSecond = await request(app)
      .post('/users/register')
      .send('name=Zed&email=zed@dead.com&password=Password1')

    expect(resSecond.statusCode).toEqual(422)

    expect(resSecond.body).toEqual({
      status: 'error',
      message: 'duplicate user',
      data: { email: 'zed@dead.com' },
    })

    done()
  })
})
