const express = require('express')
const Subject = require('../controllers/Subject.controller')
const router = express.Router()

// Get all row of subject
router.get('/', Subject.getSubject)

// Search subject
router.get('/')

module.exports = router