const Log = require('../db/models/log');

class ServiceLog {
    constructor() {
    }

    async findAll() {
        const res = await Log.find().sort({timeStamp: -1});
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
        console.log(timeStamp)
        const res = await Log.create(
            {
                timeStamp: timeStamp,
                usuario: usuario,
                caducidad: caducidad,
                token: token
            }
        );
        console.log("Log creado "+ res)
        return res;
    }


}

module.exports = ServiceLog;