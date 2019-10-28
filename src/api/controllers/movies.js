const movieModel = require('../models/movies')

module.exports = {
  getById: function(req, res, next) {
    console.log(req.body)
    movieModel.findById(req.params.movieId, function(err, movieInfo) {
      if (err) {
        next(err)
      } else {
        res.json({
          status: 'success',
          message: 'movie found',
          data: { movie: movieInfo },
        })
      }
    })
  },
  getAll: function(req, res, next) {
    movieModel.find({}, function(err, movies) {
      if (err) {
        next(err)
      } else {
        const moviesList = movies.map(movie => {
          return {
            id: movie._id,
            name: movie.name,
            releasedOn: movie.released_on,
          }
        })

        res.json({
          status: 'success',
          message: 'movies list found',
          data: { movies: moviesList },
        })
      }
    })
  },

  updateById: function(req, res, next) {
    movieModel.findByIdAndUpdate(
      req.params.movieId,
      { name: 'req.body.name' },
      function(err, movieInfo) {
        if (err) {
          next(err)
        } else {
          res.json({
            status: 'success',
            message: 'movie updated successfully',
            data: null,
          })
        }
      }
    )
  },

  deleteById: function(req, res, next) {
    movieModel.findByIdAndRemove(req.params.movieId, function(err, movieInfo) {
      if (err) {
        next(err)
      } else {
        res.json({
          status: 'success',
          message: 'movie deleted successfully',
          data: null,
        })
      }
    })
  },

  create: function(req, res, next) {
    movieModel.create(
      {
        name: req.body.name,
        released_on: req.body.released_on,
      },
      function(err, result) {
        if (err) {
          next(err)
        } else {
          res.json({
            status: 'success',
            message: 'movie added successfully',
            data: null,
          })
        }
      }
    )
  },
}
