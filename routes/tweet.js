const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const Tweet = require('../models/Tweet')

// router.get('/test', (req, res) => res.json({msg: 'testworks'}))


// @route   POST tweets/
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log(req)

    //TODO validate tweer request
   
    const newTweet = new Tweet({
      user: req.user._id,
    //   date: req.body.date,
      tweet: req.body.tweet
    })
  
    newTweet.save().then(tweet => res.json(tweet))
    // console.log(newTweet)
  })

// @route   GET tweets/
// @desc    get all tweets
// @access  Public
  router.get('/', (req, res) => {
    Tweet.find()
    .sort({date: -1})
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({notweetsfound: 'no tweets found'}))
  })

// @route   GET user tweets/
// @desc    get all user tweets
// @access  Private
  router.get('/own', passport.authenticate('jwt', { session: false}), (req, res) => {
    //   console.log(req)

    Tweet.find({ user: req.user._id}).populate('user')
      .then(tweets => {
        //   console.log(tweets)
        // `tweets` will be an array of Mongoose documents
        // we want to convert each one to a POJO, so we use `.map` to
        // apply `.toObject` to each one
        return tweets.map(tweet => tweet.toObject())
      })
      // respond with status 200 and JSON of the examples
      .then(tweets => res.status(200).json({ tweets }))
      // if an error occurs, pass it to the handler
      .catch(err => handle(err, res))
  })


// @route   DELETE user tweets/:id
// @desc    delete tweet by id
// @access  Private
// TODO check that user actually owns the tweet to be deleted
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  
    Tweet.findById(req.params.id)
    // find the tweet by id
    .then(tweet => {
          // DELETE
          tweet.remove()
        })
    .then(() => res.json({success: true}))
    .catch(err => res.status(404).json({tweetnotfound: 'no tweet found'}))
    })


  //update tweet?
  // UPDATE
// PATCH /tweets/:id
router.patch('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.body)
  // Tweet.findById(req.params.id)
  //   .then(tweet => {
   
  //     //TODO check ownership of tweet tweet user must match req.body.user

  //     // the client will often send empty strings for parameters that it does
  //     // not want to update. We delete any key/value pair where the value is
  //     // an empty string before updating
  //     Object.keys(req.body.tweet).forEach(key => {
  //       if (req.body.wine[key] === '') {
  //         delete req.body.wine[key]
  //       }
  //     })

  //     // pass the result of Mongoose's `.update` to the next `.then`
  //     return wine.update(req.body.wine)
  //   })
  //   // if that succeeded, return 204 and no JSON
  //   .then(() => res.sendStatus(204))
  //   // if an error occurs, pass it to the handler
  //   .catch(err => handle(err, res))
})




module.exports = router
