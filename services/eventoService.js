const Evento = require('../db/models/evento');
const Axios = require('axios');


class ServiceEvento {
    constructor() {
    }

    async findAll() {
        const res = await Evento.find().sort({ timeStamp: -1 });
        return res;
    }

    async findById(id) {
        const res = await Evento.findById(id);
        return res;
    }

    async findFilter(nombre, organizador, latitude, longitude) {
        let filtroBusqueda = {};

        if (nombre !== undefined && nombre !== "") {
            filtroBusqueda.nombre = {
                '$regex': nombre,
                '$options': 'i'
            };
        }

        if (organizador !== undefined && organizador !== "") {
            filtroBusqueda.organizador = {
                '$regex': organizador,
                '$options': 'i'
            };
        }
        console.log("Valores de latitud y longitud: " + latitude + " " + longitude)





        let res = await Evento.find(filtroBusqueda).sort({ timeStamp: -1 });

        if(latitude !== undefined && longitude !== undefined){
            for(let i = 0; i < res.length; i++){
                if(Math.abs(res[i].lat - latitude) > 0.2 || Math.abs(res[i].long - longitude) > 0.2){
                    res.splice(i, 1);
                    i--;
                }

            }
        }

        console.log("Resultados de la búsqueda: " + res)
        return res;
    }


    async create(evento) {
        const res = await Evento.create(
            {
                nombre: evento.nombre,
                timeStamp: new Date(evento.timeStamp),
                lugar: evento.lugar,
                lat: evento.lat,
                long: evento.long,
                organizador: evento.organizador,
                imagen: evento.imagen
            }
        );
        if(res.imagen !== undefined){
            const res_upload = await uploadImage(res._id, res.imagen);
        }

        return res;
    }

    async update(evento) {
        const res = await Evento.findByIdAndUpdate(evento._id,
            {
                nombre: evento.nombre,
                lugar: evento.lugar,
                timeStamp: new Date(evento.timeStamp),
                imagen: evento.imagen
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
            let response = await Axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + googleToken);
            if(response.status === 200){
                return {status: 200, res: {token:googleToken, exp:response.data.exp, correo: response.data.email}}
            }else{
                return {status: 401, res: "El token de sesión no es válido"}
            }
        }
        catch (error) {
            console.error('Error al verificar el token de Google:', error);
            return {status: 401, res: "Token no valido"};
        }
    }

}

module.exports =ServiceEvento;