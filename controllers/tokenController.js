const {checkGoogleToken, deleteTokenFromLog, getUserFromToken} = require('../services/tokenChecker')

const getUserByToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const user = await getUserFromToken(token);
        res.status(200).send({user: user});
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }

}


const checkToken = async (req, res, next) => {
    try {
        const tokenToCheck = req.headers.authorization
        const isValid = await checkGoogleToken(tokenToCheck);
        if (isValid == 'ok') {
            res.status(200).send("Login correcto");
        } else {
            res.status(401).send("Token no valido");
        }
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const logOutUser = async (req, res) => {
    try {
        const token = req.headers.authorization;
        await deleteTokenFromLog(token);
        res.status(200).send("Usuario deslogueado correctamente");
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

module.exports = {
    checkToken,
    getUserByToken,
    logOutUser
}