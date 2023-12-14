const Usuario = require('../db/models/usuario');
const axios = require('axios');

const ServiceProducto = require('../services/productoService');
const serviceProducto = new ServiceProducto();

const cache = require('../local_cache')
function formatarFecha(fecha) {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses comienzan desde 0
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
}
class ServiceUsuario {

    constructor() {}

    async createUsuario(usuario) {
        try {
            const foundUsuario = await Usuario.find({});
            const existingUsuarios = foundUsuario.map(usuario => usuario.toJSON());
            for (const existingUsuario of existingUsuarios) {
                if (existingUsuario['correo'] === usuario['correo']) {
                    return {message: "Ya existe un usuario con el mismo correo"};
                }
            }

            const res = await Usuario.create(
                {
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                }
            )


            return {message: 'ok', usuario: res};
        } catch (error) {
            return error;
        }
    }

    async getDataFromGoogleToken(token) {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + token);
        const json = await response.json();

        return {status: response.status, res: json}

    }

    async createOrUpdateUsuarioFromGoogle(token) {
        try {

            //Comprobamos si el usuario existe en la base de datos
            const usuario = await this.getUsuarioByCorreo(token.email);
            //Si no existe, lo creamos
            let result;
            if(usuario === [] || usuario === null){
                result = await Usuario.create(
                    {
                        nombre: token.name,
                        correo: token.email,
                        imagen: token.picture
                    }
                )
            console.log("Usuario creado con los datos de Google")
            //Si existe, en caso de que sea necesario actualizamos la imagen
            }else{
                if(usuario.imagen !== null|| usuario.imagen === json.picture){

                    result = await Usuario.findOneAndUpdate({correo: token.email}, { imagen: token.picture },
                        { new: true });
                    console.log("Usuario actualizado con los datos de Google")
                }else{
                    console.log("El usuario ya tiene foto no se actualiza nada")
                    result = usuario;
                }
            }
            return {status: 200, res: result};
        } catch (error) {
            return {status: 401, res: error};
        }
    }

    checkToken(token) {
        let val = cache.get(token)
        if(val === undefined){
            return false;
        }else{
            if(Date.now()>val){
                cache.del(token)
                return false;
            }else{
                return true;
            }
        }
    }

    async verifyGoogleToken(googleToken) {
        try {
            let response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + googleToken);

            if(response.status === 200){
                this.createOrUpdateUsuarioFromGoogle(response.data)
                cache.set(googleToken, response.data.exp*1000);
                console.log("Token guardado en cache:"+cache.get(googleToken))
                return {status: 200, res: {email:response.data.email, token:googleToken}}
            }else{
                return {status: 401, res: "El token de sesión no es válido"}
            }

        }
        catch (error) {
            console.error('Error al verificar el token de Google:', error);
            return {status: 401, res: "token no valido"};
        }
    }


    async getUsuarioByNombre(nombreUsuario) {
        const foundUsuario = await Usuario.findOne({ nombre: nombreUsuario })
        return foundUsuario;
    }

    async getUsuarioByCorreo(correo) {
        const foundUsuario = await Usuario.findOne({ correo: correo })
        return foundUsuario;
    }

    async getUsuarios() {
        const foundUsuario = await Usuario.find()
        return foundUsuario;
    }

    async deleteUsuario(correo) {
        const producto = await serviceProducto.findByUsuario(correo)
        if(producto.length !== 0){
            return {status: 409, res: "El usuario " + correo + " tiene productos y no se puede borrar"};
        }else{
            const res = await Usuario.deleteOne({correo: correo});
            return {status: 200, res: res};
        }
    }

    async updateUsuario(correo, nombreUsuario) {
        const usuario = await Usuario.findOneAndUpdate({correo: correo}, { nombre: nombreUsuario },
            { new: true });

        return usuario;
    }

    async valorar(valoracion, usuarioValorado, usuarioValorador, producto){
        const foundValorador = await Usuario.findOne({correo: usuarioValorador})
        const nuevaValoracion = {
            valorador: foundValorador.correo,
            calidad: valoracion.calidad,
            fiabilidad: valoracion.fiabilidad,
            descripcion: valoracion.descripcion,
            producto: producto
        }

        const foundUsuario  = await Usuario.findOneAndUpdate({correo: usuarioValorado}, {$push: {valoracion: nuevaValoracion}},
            { new: true });
        return foundUsuario.toJSON();
    }

    async getValoracionMedia(correo){
        const foundUsuario = await Usuario.findOne({correo: correo});

        const sumaPuntuaciones = foundUsuario.valoracion.reduce((total, val) => {
            const calidadNumerica = parseFloat(val.calidad) || 0; // parseFloat convierte a número de punto flotante, el '|| 0' maneja el caso en que no se pueda convertir
            const fiabilidadNumerica = parseFloat(val.fiabilidad) || 0;
            console.log(val.calidad)
            return total + calidadNumerica + fiabilidadNumerica;
        }, 0);

        const cantidadValoraciones = foundUsuario.valoracion.length * 2;

        const mediaPuntuaciones = cantidadValoraciones > 0 ? sumaPuntuaciones / cantidadValoraciones : 0;
        console.log(sumaPuntuaciones)
        return mediaPuntuaciones;

    }

    async getValoracion(correo){
        const foundUsuario = await Usuario.findOne({correo: correo});
        const valoraciones = foundUsuario.valoracion;

        return valoraciones;

    }

    async checkValoracion(usuarioValorado, usuarioValorador, producto) {
        const foundValorado = await Usuario.findOne({correo: usuarioValorado})
        const foundValorador = await Usuario.findOne({correo: usuarioValorador})
        const foundProducto = await serviceProducto.findById(producto);
        const subastaClosed = foundProducto.puja;
        const currentDate = new Date();
        //const formatedDate = formatarFecha(currentDate)

        if (typeof foundValorado === 'undefined' || !foundValorado) {
            return "El usuario que se quiere valorar no existe";
        } else if (typeof foundValorador === 'undefined' || !foundValorador) {
            return "El usuario que valora no existe";
        } else if (typeof foundProducto === 'undefined' || !foundProducto){
            return "El producto sobre el que se quiere valorar no existe";
        }else if(foundProducto.fechaCierre < currentDate){

            const foundValoracion = foundValorado.valoracion.filter((val) => val.producto === producto && val.valorador === foundValorador.correo);
            
            console.log(foundProducto)
            if(foundValoracion.length !== 0){
                return "A este usuario ya se le ha valorado por este producto";
            }else if(subastaClosed.usuario !== foundValorador.correo && foundProducto.usuario !== foundValorador.correo){
                return "El usuario no ha sido el ganador del producto";
            }
            return "ok"
        }else{
            return "La subasta aun no se ha cerrado";
        }
    }
    
}

module.exports = ServiceUsuario;