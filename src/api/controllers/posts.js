const postModel = require('../models/post')

module.exports = {
  getById: function(req, res, next) {
    postModel.findById(req.params.postId, function(err, postInfo) {
      if (err) {
        next(err)
      } else {
        res.json({
          status: 'success',
          message: 'post found',
          data: { post: postInfo },
        })
      }
    })
  },
  getAll: function(req, res, next) {
    postModel.find({}, function(err, posts) {
      if (err) {
        next(err)
      } else {
        const postsList = posts.map(post => {
          return {
            id: post.id,
            caption: post.caption,
            body: post.body,
            author: post.author,
            posted_on: new Date(),
          }
        })

        res.json({
          status: 'success',
          message: 'posts list found',
          data: { posts: postsList },
        })
      }
    })
  },

  updateById: function(req, res, next) {
    // find a post using a specific id that belongs to the user
    // user id is added to request during user validation by deconding jwt token
    const filter = {
      _id: req.params.postId,
      author: req.body.userId,
    }

    const { body, caption } = req.body

    // update caption and/or body
    const update = {
      ...(caption && { caption }),
      ...(body && { body }),
      edited_on: new Date(),
    }

    postModel.findOneAndUpdate(filter, update, function(err, dbRes) {
      if (err) {
        next(err)
      } else {
        if (dbRes) {
          res.json({
            status: 'success',
            message: 'post updated successfully',
          })
        } else {
          res.json({
            status: 'error',
            message: 'post was not updated',
          })
        }
      }
    })
  },

  deleteById: function(req, res, next) {
    // find a specific post and delete it if it belongs to curren user
    // user id is added to request during user validation by deconding jwt token
    postModel.deleteOne(
      {
        _id: req.params.postId,
        author: req.body.userId,
      },
      function(err, dbRes) {
        if (err) {
          next(err)
        } else {
          // parse db response
          if (dbRes && dbRes.deletedCount !== 1) {
            res.json({
              status: 'error',
              message: 'post not found',
            })
          } else {
            res.json({
              status: 'success',
              message: 'post deleted successfully',
            })
          }
        }
      }
    )
  },

  create: function(req, res, next) {
    postModel.create(
      {
        author: req.body.userId,
        caption: req.body.caption,
        body: req.body.body,
        posted_on: new Date(),
      },
      function(err, post) {
        if (err) {
          next(err)
        } else {
          res.json({
            status: 'success',
            message: 'post added successfully',
            data: post,
          })
        }
      }
    )
  },
}
