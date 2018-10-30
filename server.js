'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/user.js')
const tweet = require('./routes/tweet.js')

const app = express()

// bodyParser parses incoming requests before they hit routes/handlers. Allows access to req.body
app.use(bodyParser.urlencoded({extended: false}))
// a shallow alogorithm is used to parse incoming requests - will create a req.body consisting of key/value pairs where the value can only be a string or array
// if extended: true - value can be of any type i.e deeply nested object

app.use(bodyParser.json())
// will only parse json data


const db = require('./config/keys.js').mongoURI

//connect to mongoDB through mongoose
mongoose.connect(db)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

// test route:
app.get('/', (req, res) => res.send('hi'))

app.use(passport.initialize())
//initialize the passport authentication module
//allows it access to incoming requests
// adds a passport instance to the incoming requests

require('./config/passport')(passport)
//this is an example of currying/partial application
// invoking the require() function returns the module.exports object specified by the path supplied - in this case - module.exports returns a function - we are passing 'passport' as a paramater to that function

//passport.js defines the authentication startegy for handling the token.
//this step is essentially 'registering' our auth middleware with passport as the jwt strategy we want to use
//strategy is itself a custom middleware - all requests to protected endpoints will pass through this middleware
//the token will be checked and verified before the route is hit & request allowed

app.use('/users', users)
app.use('/tweets', tweet)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port ${port}`))
