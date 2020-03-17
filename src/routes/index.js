const router = require('express').Router()

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = require('./swagger')

// use swagger as documantation
const specs = swaggerJsdoc(swaggerOptions)
router.use('/', swaggerUi.serve)
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
)

router.use('/users', require('./users'))
router.use('/posts', require('./posts'))

module.exports = router