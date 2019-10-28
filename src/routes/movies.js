const express = require('express')
const router = express.Router()
const moviesController = require('../api/controllers/movies')

router.get('/', moviesController.getAll)
router.post('/', moviesController.create)

router.get('/:movieId', moviesController.getById)
router.put('/:movieId', moviesController.updateById)

router.delete('/:movieId', moviesController.deleteById)

module.exports = router