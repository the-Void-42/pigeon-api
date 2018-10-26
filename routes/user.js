const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Validator = require('validator')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const passport = require('passport')

const User = require('../models/User')
const { BadEmailParamsError, BadPasswordParamsError } = require('../lib/custom-errors')
const { requireToken } = require('../config/passport')

// @route   GET /users/test
// @desc    tests GET route
// @access  Public/unauthenticated
router.get('/test', (req, res) => res.json('testworks'))

// @route   POST /users/register
// @desc    register user POST route
// @access  Public/unauthenticated
router.post('/register', (req, res) => {

  if(Validator.isEmail(req.body.email) === false) {
    const emailError = new BadEmailParamsError()
    return res.status(400).json(emailError)
  }

  if(!req.body.password ||
      req.body.password.length < 3) {
    const passwordError = new BadPasswordParamsError()
    return res.status(400).json(passwordError)
  }


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
  .catch(err => console.log(err))
})

router.post('/login', (req, res) => {

  // check to see if valid email
  if(Validator.isEmail(req.body.email) === false) {
    const emailError = new BadEmailParamsError()
    return res.status(400).json(emailError)
  }

  // set email and password to variables
  const email = req.body.email
  const password = req.body.password

  User.findOne({ email })
  .then(user => {
    // check if user exists
    if(!user) {
      console.log('user does not exists')
      return res.status(404).json('user does not exist')
    }
    // compare passwords
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      //check for match
      if(isMatch) {
        const payload = {
          id: user.id,
          email: user.email
        }

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          // token will expire in an hour - user will have to log in again

          //.sign takes callback if the action is asynchronous - calls the function with either an error or the generated JWT
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
              // adds the bearer scheme header
            })
          }
        )

      } else {
        return res.status(400).json(errors)
      }
    })
  })
})

// @route   GET api/users/current
// @desc    return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  //passport.authenticate takes the strategy thats to be used as the first param and applies it to that route - route is now protected
  // the supplied callback is used if the authentication strategy passed successfully - req.user will contain the authenticated users
  // by default if authentication strategy fails - 401 Unauthorized status returned
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})


module.exports = router
