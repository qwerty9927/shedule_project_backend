const express = require('express')
const Subject = require('../controllers/Subject.controller')
const router = express.Router()

// Add data
router.post('/addSubject', Subject.addSubject)

// Edit data
router.put('/editSubject', Subject.editSubject)

// Delete data
router.delete('/deleteSubject', Subject.deleteSubject)

module.exports = router