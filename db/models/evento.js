const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const eventoSchema = new Schema({
    nombre: String,
    timestamp: Date,
    lugar: Number,
    lat: Number,
    long: Number,
    organizador: String,
    imagen: String
})


module.exports = mongoose.models.Evento || mongoose.model('Evento', eventoSchema)
