import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import mongoose from '../config/database'

// import configuration
import config from '../config'

// import routes
import users from './routes/users'
import movies from './routes/movies'

import { validateUser } from './api/validators/users'

const app = express()

app.set('secretKey', config.secretKey)

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MondoDB connection error:')
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


app.use(function (req, res, next) {
  res.status(404).send("404: page not found")
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

app.listen(process.env.PORT || 5000, function() {
  console.log('Node server listening on port 3000')
})
