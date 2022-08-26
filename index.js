const express = require('express')
const cors = require('cors')
const app = express()

global.__basedir = __dirname
const PORT = 5000
// app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
    res.send('hello')
})
app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        meg: err.message
    })
})
app.listen(3000)