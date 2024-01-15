const ServiceEvento = require('../services/eventoService');
const serviceEvento = new ServiceEvento();

const {checkGoogleToken} = require('../services/tokenChecker');
const {inspect} = require("util");

const listarEventos = async (req, res) => {
    try {
        if(req.params.id !== undefined){
            console.log("Buscando evento con id " + req.params.id);
            const evento = await serviceEvento.findById(req.params.id);
            res.status(200).send({evento: evento});
        }else if(req.body.nombre !== undefined || req.body.cp !== undefined || req.body.organizador !== undefined || req.body.latitude !== undefined || req.body.longitude !== undefined) {
            console.log("Aplicando filtros "+ req.body.nombre);
            const eventos = await serviceEvento.findFilter(
                req.body.nombre,
                req.body.organizador,
                req.body.lat,
                req.body.long);

            res.status(200).send({eventos: eventos});
        }else{
            console.log("Listando eventos")
            const eventos = await serviceEvento.findAll();
            res.status(200).send({eventos: eventos});
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getEventosProximos = async (req, res) => {
    try {
        const eventos = await serviceEvento.findFilter();
        res.status(200).send({eventos: eventos});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getEventoByNombre = async (req, res) => {
    try {
        const eventos = await serviceEvento.find(
            req.body.nombre
        );
        res.status(200).send({eventos: eventos});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const guardarEvento = async (req, res) => {
    try {
            let token = await checkGoogleToken(req.headers.authorization);
            if(token !== 'ok'){
                res.status(401).send("Token no valido");
            }else{
            if (typeof req.body._id !== "undefined" && req.body._id !== null && req.body._id !== '') {
                console.log("Actualizando evento " + req.body._id);
                const evento = await serviceEvento.update(req.body);
                res.status(200).send({message: 'Evento ' + req.body._id + ' actualizado con éxito', evento: evento});

            } else {
                const evento = await serviceEvento.create(
                    req.body.evento
                )
                console.log(evento)
                if (res !== null && res !== undefined && res !== ''){
                    res.status(201).send({message: 'Evento creado con éxito', evento: evento});
                } else {
                    res.status(400).send({message: 'No se ha podido crear el evento'});
                }
            }
            }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}


const borrarEvento = async (req, res) => {
    try {
        let token = await checkGoogleToken(req.headers.authorization);
        if(token !== 'ok'){
            res.status(401).send("Token no valido");
        }else {
            const evento = await serviceEvento.delete(req.params.id);
            if (evento) {
                res.status(200).send({message: 'Evento ' + req.params.id + ' borrado con éxito', evento: evento});
            } else {
                res.status(400).send({message: 'No existe el evento ' + req.params.id});
            }
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {
    listarEventos,
    guardarEvento,
    borrarEvento,
    getEventosProximos,
    getEventoByNombre
}