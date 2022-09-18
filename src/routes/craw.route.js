const express = require('express')
const router = express.Router()
const Craw = require('../controllers/Craw.controller')
const verifyTokenAdmin = require('../middlewares/verifyTokenAdmin')

// Middleware
router.use(verifyTokenAdmin)

// Receive data from crawler
router.post('/', Craw.receiveData)


module.exports = router