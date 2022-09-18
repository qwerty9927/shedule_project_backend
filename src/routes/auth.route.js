const express = require('express')
const Auth = require('../controllers/Auth.controller')
const router = express.Router()

// Login
router.post('/login', Auth.login)

// Resgister
router.post('/resgister', Auth.resgister)

// Auth2
//router.get('/login_2)

// RefreshToken
router.get('/refreshToken', Auth.refreshToken)

// // Logout
router.get('/logout', Auth.logout)  

module.exports = router