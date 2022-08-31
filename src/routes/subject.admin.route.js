const express = require('express')
const Subject = require('../controllers/Subject.controller')
const router = express.Router()

// Add data
router.post('/addSubject/:school-:schoolYear-:code', Subject.addSubject)

// Edit data
router.put('/editSubject/:school-:schoolYear-:code', Subject.editSubject)

// Delete data
router.delete('/deleteSubject/:school-:schoolYear-:code-:id', Subject.deleteSubject)

module.exports = router