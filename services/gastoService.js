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

    async create(gasto) {
        const res = await Gasto.create(
            {
                timeStamp: new Date(),
                concepto: gasto.concepto,
                importe: gasto.importe,
                eMail: gasto.eMail,
                token: gasto.token,
                imagen: gasto.imagen,
                direccionPostal: gasto.direccionPostal,
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

        const numeroUsuariosDistintos = 0;
        const setUsuarios = new Set();
        const totalPagos = await Gasto.find();
        for (let i = 0; i < totalPagos.length; i++) {
            setUsuarios.add(totalPagos[i].eMail);
        }


        let pagoTotal = 0;
        for(let i = 0; i < totalPagos.length; i++){
            pagoTotal += totalPagos[i].importe;
        }

       return pagadoUsuario - (pagoTotal / setUsuarios.size)
    } catch (error) {
        return -1;
    }
    }

    async delete(id) {
        const gasto = await this.findById(id);
        const res = await Gasto.findByIdAndDelete(id);
        return gasto;
    }



}

module.exports =ServiceGasto;