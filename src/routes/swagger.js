// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "Simple API server that is able do CRUD operations on a MongoDB and authenitcate users using JWT tokens. The current implementation immitates blog api.  <br /> <br /> The sections below provide reference documentation for the endpoints in the Blog REST API.  To make a request:<br /> <ol> <li>Expand an <b>endpoint</b>. </li> <li>Click <b>Try it out</b>. </li> <li>Customize the request body parameter.</li> <li>Click <b>Execute</b>. You will see the cURL request submitted to the API server and the corresponding response.</li></ol>",
      license: {
        name: "MIT License",
        url: "https://choosealicense.com/licenses/mit/"
      }
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local server"
      },
      {
        url: "https://stark-brushlands-58685.herokuapp.com/api/v1",
        description: "Production server"
      }
    ]
  },
  apis: [
    // note the files need to be referred from the root
    './doc/openapi.yml'
  ]
};

module.exports = options