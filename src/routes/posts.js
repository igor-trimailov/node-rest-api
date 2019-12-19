const express = require('express')
const router = express.Router()
const postsController = require('../api/controllers/posts')
const usersValidator = require('../api/validators/users')

// public routes
router.get('/', postsController.getAll)
router.get('/:postId', postsController.getById)

// authenticated routes
router.post('/', usersValidator, postsController.create)
router.put('/:postId', usersValidator, postsController.updateById)
router.delete('/:postId', usersValidator, postsController.deleteById)

module.exports = router
