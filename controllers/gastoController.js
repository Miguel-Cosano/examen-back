const ServiceGasto = require('../services/gastoService');
const serviceGasto = new ServiceGasto();

const {checkGoogleToken} = require('../services/tokenChecker');
const {inspect} = require("util");

const listarGastos = async (req, res) => {
    try {
        if(req.params.id !== undefined){
            console.log("Buscando gasto con id " + req.params.id);
            const gasto = await serviceGasto.findById(req.params.id);
            res.status(200).send({gasto: gasto});
        //}
        // else if(req.body.nombre !== undefined || req.body.cp !== undefined || req.body.organizador !== undefined || req.body.latitude !== undefined || req.body.longitude !== undefined) {
        //     console.log("Aplicando filtros "+ req.body.nombre);
        //     const gastos = await serviceGasto.findFilter(
        //         req.body.nombre,
        //         req.body.organizador,
        //         req.body.lat,
        //         req.body.long);
        //
        //     res.status(200).send({gastos: gastos});
        }else{
            console.log("Listando todos los  gastos")
            const gastos = await serviceGasto.findAll();
            res.status(200).send({gastos: gastos});
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

// const getGastosProximos = async (req, res) => {
//     try {
//         const gastos = await serviceGasto.findFilter();
//         res.status(200).send({gastos: gastos});
//     } catch (error) {
//         res.status(500).send({success: false, message: error.message});
//     }
// }


const guardarGasto = async (req, res) => {
    try {
        let token = await checkGoogleToken(req.headers.authorization);
        if(token !== 'ok'){
            res.status(401).send("Token no valido");
         }else{
            if (typeof req.body._id !== "undefined" && req.body._id !== null && req.body._id !== '') {
                console.log("Actualizando gasto " + req.body._id);
                const gasto = await serviceGasto.update(req.body.gasto);
                res.status(200).send({message: 'Gasto ' + req.body._id + ' actualizado con éxito', gasto: gasto});

            } else {
                const gasto = await serviceGasto.create(
                    req.body.gasto
                )
                if (res !== null && res !== undefined && res !== ''){
                    res.status(201).send({message: 'Gasto creado con éxito', gasto: gasto});
                } else {
                    res.status(400).send({message: 'No se ha podido crear el gasto'});
                }
            }
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}


const borrarGasto = async (req, res) => {
    try {
        let token = await checkGoogleToken(req.headers.authorization);
        if(token !== 'ok'){
            res.status(401).send("Token no valido");
        }else {
            const gasto = await serviceGasto.delete(req.params.id);
            if (gasto) {
                res.status(200).send({message: 'Gasto ' + req.params.id + ' borrado con éxito', gasto: gasto});
            } else {
                res.status(400).send({message: 'No existe el gasto ' + req.params.id});
            }
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getSaldo = async (req, res) => {
    try {
        // let token = await checkGoogleToken(req.headers.authorization);
        // if(token !== 'ok'){
        //     res.status(401).send("Token no valido");
        // }else {
            const saldo = await serviceGasto.getSaldo(req.params.eMail);
            res.status(200).send({saldo: saldo});
        //}
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {
    listarGastos,
    guardarGasto,
    borrarGasto,
    getSaldo
    //getGastosProximos,
    //getGastoByNombre
}