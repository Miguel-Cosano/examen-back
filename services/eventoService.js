const Evento = require('../db/models/evento');
const {uploadImage} = require('./imageService')
const Axios = require('axios');

class ServiceEvento {
    constructor() {
    }

    async findAll() {
        const res = await Evento.find();
        return res;
    }

    async findById(id) {
        const res = await Evento.findById(id);
        return res;
    }


    async findByNombre(nombre) {
        const res = await Evento.find(
            {
                nombreLinea:
                    {
                        '$regex': nombre,
                        '$options': 'i'
                    }
            }
        );
        return res;
    }

    async create(nombre,timeStamp,lugar,lat,long,organizador,imagen) {
        const res = await Evento.create(
            {
                nombre: nombre,
                timeStamp: timeStamp,
                lugar: lugar,
                lat: lat,
                long: long,
                organizador: organizador,
                imagen: imagen
            }
        );

        const res_upload = await uploadImage(res._id, res.imagen);

        return res_upload;
    }

    async update(id, nombre, lugar, timeStamp) {
        const res = await Evento.findByIdAndUpdate(id,
            {
                nombre: nombre,
                lugar: lugar,
                timeStamp: timeStamp
            },
            {new: true}
        );
        return res;
    }

    async delete(id) {
        const evento = await this.findById(id);
        const res = await Evento.findByIdAndDelete(id);
        return evento;
    }

    async verifyGoogleToken(googleToken) {
        try {
            const response = await Axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + googleToken);
            console.log(response)
            return {status: 200, res: await response.data};
        }
        catch (error) {
            console.error('Error al verificar el token de Google:', error);
            return {status: 401, res: "token no valido"};
        }
    }

}

module.exports =ServiceEvento;