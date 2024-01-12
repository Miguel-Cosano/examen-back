const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const logSchema = new Schema({
    timeStamp: Date,
    usuario: String,
    caducidad: String,
    token: String
})

module.exports =  mongoose.model('Log', logSchema)
