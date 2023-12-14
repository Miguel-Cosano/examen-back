const {getCoordinatesFromPostalCode} = require('../controllers/locationController')
const express = require('express')

const routerLocation = express.Router()

routerLocation.get('/coord', getCoordinatesFromPostalCode)

module.exports = {
    routerLocation: routerLocation
}
