const jwt = require('jsonwebtoken')

module.exports = function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(
    err,
    decoded
  ) {
    if (err) {
      // log the real error in the logs
      console.log(err.message)
      
      res.json({
        status: 'error',
        message: 'access error',
        data: null,
      })
    } else {
      req.body.userId = decoded.id
      next()
    }
  })
}
