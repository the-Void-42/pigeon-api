const mongoose = require('mongoose')
const {Schema} = mongoose

const TweetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    },
    tweet: {
        type: String,
        require: true
    }
})

module.exports = Tweet = mongoose.model('tweets', TweetSchema) 