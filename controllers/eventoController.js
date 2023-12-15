const ServiceEvento = require('../services/eventoService');
const serviceEvento = new ServiceEvento();

const ServiceLog = require('../services/serviceLog');
const serviceLog = new ServiceLog();

let cache = [];
const listarEventos = async (req, res) => {
    try {
        const eventos = await serviceEvento.findAll();
        res.status(200).send({eventos: eventos});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getEventoById = async (req, res) => {
    try {
        const evento = await serviceEvento.findById(req.params.id);
        res.status(200).send({evento: evento});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }

}

const getEventosProximos = async (req, res) => {
    try {
        //Recibe lat y long
        //nombre
        //organizador
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

const listarLogs = async (req, res) => {
    try {
        const logs = await serviceEvento.findAllLogs();
        res.status(200).send({logs: logs});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}
checkLocalCache = (token) => {
    const tokenIndex = cache.findIndex(([token, caducidad]) => token === tokenToCheck)
    if(tokenIndex !== -1){
        const [, caducidad] = cache[tokenIndex];
        if(caducidad < new Date().getTime()){
            cache.splice(tokenIndex, 1);
            return "Caducado";
        }else{
            return "Ok";
        }
    }else{
        return "No encontrado";
    }

}

const checkToken = async (req, res) => {
    try {
        const isInCache = checkLocalCache(req.query.token);
        if (isInCache === "Ok") {
            return res.status(200).send("Ok")
        } else {
            //Si no lo encuentro, verifico el token
            const isValid = await serviceEvento.verifyGoogleToken(req.query.token);
            //Devuelve un json con token y caducidad
            if (isValid.status === 200) {
                console.log(isValid.res)
                cache.push([isValid.res.token, isValid.res.exp]);


                serviceLog.create(Date().toString(),isValid.res.email,req.query.token, isValid.res.exp);


                res.status(200).send("Ok")
            } else {
                res.status(401).send("Token no valido")
            }
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}



const guardarEvento = async(req, res) => {
    try {
        const token = req.headers.authorization;
        let ok;
        if(token === null || token === ""){
            ok = "Nulo";
        }else{
            ok = await checkToken(token);
        }
        if(ok === "Ok"){
            if (typeof req.body.id !== "undefined" && req.body.id !== null && req.body.id !== '') {

                const evento = await serviceEvento.update(
                    req.body.id,
                    req.body.nombre,
                    req.body.lugar,
                    req.body.timeStamp
                );
                res.status(200).send({message: 'Parada ' + req.body.id + ' actualizada con éxito', parada: parada});

            } else {
                const parada = await serviceParada.create(
                    req.body.id,
                    req.body.nombre,
                    req.body.lugar,
                    req.body.timeStamp
                )
                console.log(parada)
                if(parada.message !== 'ok'){
                    res.status(400).send({message: parada.message});
                } else {
                    res.status(201).send({message: 'Parada creada con éxito', parada: parada});
                }


            }
        }else{
            res.status(400).send({success: false, message: ok})
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}


const borrarEvento = async (req, res) => {
    try {
        const evento = await serviceEvento.delete(req.params.id);
        if (evento) {
            res.status(200).send({message: 'Evento ' + req.params.id + ' borrado con éxito', evento: evento});
        } else {
            res.status(400).send({message: 'No existe el evento ' + req.params.id});
        }

    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {listarEventos, guardarEvento, borrarEvento, listarLogs, getEventosProximos, getEventoByNombre, checkToken}