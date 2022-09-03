const express = require('express')
const Subject = require('../controllers/Subject.controller')
const router = express.Router()

// Get all row of subject
router.get('/', Subject.getSubject)

// Search subject
router.get('/search', Subject.searchSubject)

// Middelware

// Add subject for shedule
router.post('/addSubjectoOfShedule', Subject.addSubjectOfShedule)

// // Edit subject of shedule
// router.put('/editSubjectOfShedule', Subject.editSubjectOfShedule)

// // Delete subject of shedule
// router.delete('/deleteSubjectOfShedule', Subject.deleteSubjectOfShedule)

// // Delete shedule
// router.delete('/deleteShedule', Subject.deleteShedule)

// // Save shedule
// router.delete('/saveShedule', Subject.saveShedule)

module.exports = router