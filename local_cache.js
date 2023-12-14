const NodeCache = require('node-cache');

class PrivateCacheLocal {
    constructor() {
        console.log("CREANDO CACHE LOCAL DE CERO")
        this.cache = new NodeCache({
            stdTTL: 0,
            checkperiod: 120
        });
    }
}
class CacheLocal {

    static getInstance() {
        if (!CacheLocal.instance) {
            CacheLocal.instance = new PrivateCacheLocal();
        }
        return CacheLocal.instance;
    }
}

module.exports = CacheLocal;
