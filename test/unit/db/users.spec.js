const mongoose = require('mongoose')
const UserModel = require('../../../src/api/models/user')

const userData = {
  name: 'JestUser',
  email: 'jest@email.com',
  password: 'Password1',
}

describe('User Model Unit Test using in-memory mongo db', () => {
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
    await mongoose.connection.close()
  })

  it('successfully add and save a new user', async () => {
    const validUser = new UserModel(userData)
    const savedUser = await validUser.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.password).toBeDefined()
    expect(savedUser.name).toBe(userData.name)
    expect(savedUser.email).toBe(userData.email)
  })
})
