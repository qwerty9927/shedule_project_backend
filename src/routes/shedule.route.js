const express = require('express')
const Shedule = require('../controllers/Shedule.controller')
const router = express.Router()
const verifyTokenUser = require('../middlewares/verifyTokenUser')

// Middleware
router.use(verifyTokenUser)

// Create shedule
router.get('/createTable', Shedule.createTable)

// Delete shedule
router.delete('/deleteTable', Shedule.deleteTable)

// Add subject for shedule
router.post('/addSubjectOfTable', Shedule.addSubjectOfTable)

// // Delete subject of shedule
router.delete('/deleteSubjectOfTable', Shedule.deleteSubjectOfTable)




module.exports = router