const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { createClient } = require('redis')
const routerCraw = require('./src/routes/craw.route')
const routerAdminSubject = require('./src/routes/subject.route')
const routerShedule = require('./src/routes/shedule.route')
const routerAuth = require('./src/routes/auth.route')
require('dotenv').config()

const app = express()
const client = createClient()
global.__basedir = __dirname

// app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', (req, res) => {
	res.send('hello')
})
app.use('/api/craw', routerCraw)
app.use('/api/subject', routerAdminSubject)
app.use('/api/shedule', routerShedule)
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

client.on("error", (err) => console.log("Redis client error", err))
client.connect().then((res) => {
	global._redisConnect = client
	console.log("Connect redis success")
})

mongoose.connect(process.env.URLDB, {}, (err) => {
	if (err) {
		console.log("Error database!")
		console.log(err)
	} else {
		global._mongodbConnect = mongoose.connection
		console.log("Connect mongoose success")
	}
})

app.listen(process.env.PORT || 3000, () => {
	console.log("Listen on port " + (process.env.PORT || 3000))
})