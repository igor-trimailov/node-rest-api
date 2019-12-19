const app = require('./server')

// capture the port the app runs
// TODO: does it make sense to have a fallback?
const port = process.env.PORT || 5000
app.listen(port, function() {
  console.log(`Node server listening on port ${port}`)
})