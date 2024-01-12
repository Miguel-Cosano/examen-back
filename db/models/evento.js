const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const eventoSchema = new Schema({
    nombre: {type: String,required: true},
    timeStamp: {type: Date,required: true},
    lugar: {type: Number,required: true},
    lat: {type: Number, required: true},
    long: {type: Number, required: true},
    organizador: {type: String,required: true},
    imagen: String
})


module.exports = mongoose.model('Evento', eventoSchema)
