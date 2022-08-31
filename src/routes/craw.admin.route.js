const express = require('express')
const router = express.Router()
const Craw = require('../controllers/Craw.controller')

// Receive data from crawler
router.post('/:school-:schoolYear-:code', Craw.receiveData)


module.exports = router