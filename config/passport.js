const JwtStrategy = require('passport-jwt').Strategy
// defines an authorization strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
// allows extraction of the payload/user data from the request
// const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('users')
// 'users' comes from the module.exports syntax of the User Schema
const keys = require('../config/keys')

//the strategy:
// this strategy checks to see if a user has a valid token.
// when an API call is made by the user through the App - their token is sent with it. (it is stored on the client)
// this strategy is a middleware (a function) that is called before the request is allowed to access the route
// it checks to see if the users token exists - if so - they are allowed to access that route.

module.exports = (passport) => {
  // this module is exporting a function
  // the return value is either the success or failure of the strategy
passport.use(new JwtStrategy({
  //takes 2 arguments:
  //arg 1: an object literal that contains the extracted token and secret
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // this function extracts the jwt_payload and allows the extraction of the token from the incoming request
  // the token was given the Bearer header when it was created on login - there are other types of auth schemes that could have been used i.e. OAauth
  //.fromAuthHeaderAsBearerToken() creates an extractor that specifically looks for the token when the authorization header has 'Bearer' specified
  secretOrKey: keys.secretOrKey
  // the string/buffer used when the token was created - now used to verify it.
},
// arg 2: the verify function that takes 2 arguments: the token payload and the doneCallBack function which will either return the user or an unauthorized error
(jwt_payload, doneCallBack) => {
  // jwt_payload = the payload we defined when we created the token - it contains user id/email
  User.findById(jwt_payload.id)
  .then(user => {
    if(user) {
      // console.log(doneCallBack(null, user))
      return doneCallBack(null, user)
    }
    // console.log(doneCallBack(null, user))
    return doneCallBack(null, false)
  })
  .catch(err => console.log(err))
}))
}
