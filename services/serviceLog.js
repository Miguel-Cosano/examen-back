const Log = require('../db/models/log');

class ServiceEvento {
    constructor() {
    }

    async findAll() {
        const res = await Log.find();
        return res;
    }

    async findByTimeStamp(timeStamp) {
        const res = await Log.find(
            {
                timeStamp: timeStamp
            }
        );
        return res;
    }



    async create(timeStamp, usuario, caducidad, token) {
        const res = await Log.create(
            {
                timeStamp: timeStamp,
                usuario: usuario,
                caducidad: caducidad,
                token: token
            }
        );
        return res;
    }


}

module.exports =ServiceEvento;