const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const logSchema = new Schema({
    timestamp: String,
    usuario: String,
    caducidad: String,
    token: String
})


module.exports = mongoose.models.Log || mongoose.model('Log', logSchema)
