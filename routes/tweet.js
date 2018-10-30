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

    Tweet.find({ user: req.user._id}).populate('itemReference')
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




module.exports = router
