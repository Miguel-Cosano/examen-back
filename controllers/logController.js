const ServiceLog = require('../services/serviceLog');
const serviceLog = new ServiceLog();


const listarLogs = async (req, res) => {
    try {
        const logs = await serviceLog.findAll();
        res.status(200).send({logs: logs});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {listarLogs};