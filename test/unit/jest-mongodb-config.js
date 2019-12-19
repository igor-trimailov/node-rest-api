module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.2.0', // Version of MongoDB
      skipMD5: true
    },
    autoStart: false
  }
};