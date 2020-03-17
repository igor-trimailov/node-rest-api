// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "Simple API server that is able do CRUD operations on a MongoDB and authenticate users using JWT tokens. The current implementation imitates blog api.",
      license: {
        name: "MIT License",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "Igor",
        url: "https://www.linkedin.com/in/igortrimailov/"
      }
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local server"
      }
    ]
  },
  apis: [
    // note the files need to be referred from the root
    './doc/openapi.yml'
  ]
};

module.exports = options