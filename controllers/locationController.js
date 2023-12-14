const ServiceLocation = require('../services/locationService');
const serviceLocation = new ServiceLocation();

const getCoordinatesFromPostalCode = async (req, res, next) => {
    try {
        const coordenadas = await serviceLocation.getCoordenadasByCodPostal(req.query.codPostal)
        res.status(200).json(coordenadas)
    } catch (error) {
        res.status(401).send({success: false, message: 'No se ha podido obtener las coordenadas para el código postal ' + req.query.codPostal});
    }
}

const getHuellaCarbono = async (req, res) => {
    try {
        const huella = await serviceLocation.getHuellaCarbono(req.query.userLat,req.query.userLong, req.query.codPostalProducto);
        res.status(200).send(huella);
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {getCoordinatesFromPostalCode}