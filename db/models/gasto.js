const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const gastoSchema = new Schema({
    timeStamp: {type: Date,required: true},
    concepto: {type: String,required: true},
    importe: {type: Number,required: true},
    eMail: {type: String, required: true},
    token: {type: String, required: true},
    imagen: String,
    direccionPostal: String,
    lat: Number,
    long: Number
})


module.exports = mongoose.model('Gasto', gastoSchema)
