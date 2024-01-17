const Gasto = require('../db/models/gasto');
const Axios = require('axios');


class ServiceGasto {
    constructor() {
    }

    async findAll() {
        const res = await Gasto.find().sort({ timeStamp: -1 });
        return res;
    }

    async findById(id) {
        const res = await Gasto.findById(id);
        return res;
    }
/*
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





        let res = await Gasto.find(filtroBusqueda).sort({ timeStamp: -1 });

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
*/

    async create(gasto) {
        const res = await Gasto.create(
            {
                timeStamp: new Date(),
                concepto: gasto.concepto,
                importe: gasto.importe,
                eMail: gasto.eMail,
                token: gasto.token,
                imagen: gasto.imagen,
                codPostal: gasto.codPostal,
                lat: gasto.lat,
                long: gasto.long
            }
        );
        return res;
    }

    async getSaldo(eMail) {
    try {
        const pagosUsuario = await Gasto.find({eMail: eMail});
        let pagadoUsuario = 0;
        for (let i = 0; i < pagosUsuario.length; i++) {
            pagadoUsuario += pagosUsuario[i].importe;
        }
        console.log("PAGADO POR USUARIO: " + pagadoUsuario);

        const setUsuarios = new Set();
        const totalPagos = await Gasto.find();
        for(let i = 0; i < totalPagos.length; i++){
            setUsuarios.add(totalPagos[i].eMail);
        }
        console.log("Usuarios: " + JSON.stringify(setUsuarios));

        let pagoTotal = 0;
        for(let i = 0; i < totalPagos.length; i++){
            pagoTotal += totalPagos[i].importe;
        }

        console.log("Pago total: " + pagoTotal);
       return pagoTotal/setUsuarios.size - pagadoUsuario;
    } catch (error) {
        return 0;
    }
    }

    async delete(id) {
        const gasto = await this.findById(id);
        const res = await Gasto.findByIdAndDelete(id);
        return gasto;
    }



}

module.exports =ServiceGasto;