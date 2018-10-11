'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//TODO set up and configure database

//TODO connect through mongoose

app.use(passport.initialize())

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port ${port}`))
