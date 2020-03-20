# node-rest-api
Simple API server that is able do CRUD operations on MongoDB and authenticate users using JWT tokens. The current implementation imitates a **blog api**.

### Installation
Clone node-rest-api from [github](https://github.com/igor-trimailov/node-rest-api)
```sh
$ git clone git@github.com:igor-trimailov/node-rest-api.gi
```

Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable). See below an example of how this is done in macOS, with [Homebrew](https://brew.sh/):
```sh
$ brew install yarn 
```
Install [mongodb](https://docs.mongodb.com/manual/installation/) and start it. See below an example of how to do this in macOS:
```
$ brew install mongodb-community@4.2
$ brew tap mongodb/brew
$ brew services start mongodb-community@4.2 
```
Run `yarn watch`. It will start your server at http://localhost:5000/api/v1/ and listen to code changes.
```
$ yarn watch
```

### API Documentation
Check out what this API does  **[here](https://stark-brushlands-58685.herokuapp.com/api/v1/?fbclid=IwAR0o2XF4g0WLvmdc_3mahMy4f9IjZb1l2cYIROoz_SGRwJdogrI1Z2_Ld3A)**. (work in progress)
See **[open documentation issues](https://github.com/igor-trimailov/node-rest-api/labels/documentation)** for what's left to document. 

### Features
- express server
- mongoose db setup to communicate with local/remote db
- jwt token user authentication

### Planned work
- finalize the swagger documentation
- jwt token refresh

### License
MIT. Open source, yeah!