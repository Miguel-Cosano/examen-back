const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const logSchema = new Schema({
    timeStamp: Date,
    message: String
})

module.exports =  mongoose.model('Log', logSchema)
