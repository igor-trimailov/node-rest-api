const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('../config/database')
const cors = require('cors')

// import configuration
const config = require('../config')

// import routes
const users = require('./routes/users')
const movies = require('./routes/movies')

const validateUser = require('./api/validators/users')

const app = express()

// Set up cors whitelist
const corsOptions = {
  origin: function(origin, callback) {
    if (config.corsWhiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}
app.use(cors(corsOptions))

// set secret key
app.set('secretKey', config.secretKey)

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MondoDB connection error:'),
)

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.json({ tutorial: 'Build REST api with node.js' })
})

// public route:
app.use('/users', users)

// authenticated route
app.use('/movies', validateUser, movies)

app.use(function(req, res, next) {
  res.status(404).send('404: page not found')
})

// express and 404?
// app.use(function(req, res, next) {
//   const err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// error handling
// app.use(function(err, req, res, next) {
//   console.log(err)
//   if (err.status === 404) {
//     res.status(404).json({ message: 'page not found' })
//   } else {
//     res
//       .status(500)
//       .json({ message: 'something, somewhere went terribly wrong' })
//   }
// })

app.get('/favicon.ico', function(req, res) {
  res.sendStatus(204)
})

const port = process.env.PORT || 5000
app.listen(port, function() {
  console.log(`Node server listening on port ${port}`)
})
