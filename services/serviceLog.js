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



    async create(message) {
        const res = await Log.create(
            {
                timeStamp: new Date(),
                message: message
            }
        );
        console.log("Log creado "+ res)
        return res;
    }


}

module.exports = ServiceLog;