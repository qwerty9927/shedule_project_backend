const express = require('express')
const Subject = require('../controllers/Subject.controller')
const verifyTokenAdmin = require('../middlewares/verifyTokenAdmin')
const router = express.Router()

// Get all row of subject
router.get('/', Subject.getSubject)

// Search subject
router.get('/search', Subject.searchSubject)

// Middleware
router.use(verifyTokenAdmin)

// Add data
router.post('/addSubject', Subject.addSubject)

// Edit data
router.put('/editSubject', Subject.editSubject)

// Delete data
router.delete('/deleteSubject', Subject.deleteSubject)

module.exports = router