const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const routerCraw = require('./src/routes/craw.admin.route')
const routerAdminSubject = require('./src/routes/subject.admin.route')
const routerShedule = require('./src/routes/shedule.route')
const routerAuth = require('./src/routes/auth.route')
const app = express()

global.__basedir = __dirname
// app.use(cors())
dotenv.config()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('hello')
})
app.use('/api/admin/craw', routerCraw)
app.use('/api/admin/subject', routerAdminSubject)
app.use('/api/subject', routerShedule)
app.use('/api/auth', routerAuth)
app.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        meg: "NOT FOUND"
    })
})
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        meg: err.message
    })
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Listen on port " + (process.env.PORT || 3000))
})