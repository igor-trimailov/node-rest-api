const express = require('express')
const router = express.Router()
const userController = require('../api/controllers/users')

router.get('/', userController.getAll)
router.post('/register', userController.create)
router.post('/authenticate', userController.authenticate)
router.post('/refresh', userController.refresh)

module.exports = router