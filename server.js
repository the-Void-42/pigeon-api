'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const db = require('./config/keys.js').mongoURI

//connect to mongoDB through mongoose
mongoose.connect(db)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('hi'))

app.use(passport.initialize())

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port ${port}`))
