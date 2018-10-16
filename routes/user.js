const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')

// @route   GET /users/test
// @desc    tests GET route
// @access  Public/unauthenticated
router.get('/test', (req, res) => res.json('testworks'))

// @route   POST /users/register
// @desc    register user POST route
// @access  Public/unauthenticated
router.post('/register', (req, res) => {
// TODO: Validation strategy for user input

User.findOne({ email: req.body.email })
.then(user => {
  if(user) {
    console.log('user already exists')
  } else {
    //create new instance of User model:
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    })

    //encrypt password:
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw error
        newUser.password = hash
        newUser.save() //use mongoose .save() method to save the instance of newUser
        // .save() returns a promise to resolve:
        .then(user => res.json(user))
        .catch(err => console.log(err))
      })
    })
  }
})
.catch()
})

module.exports = router
