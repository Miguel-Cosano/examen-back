const NodeCache = require('node-cache');

class CacheLocal {
    static _instance;

    constructor(ttlSeconds) {
        console.log("CacheLocal created")
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }

    static getInstance() {
        if (!CacheLocal._instance) {
            CacheLocal._instance = new CacheLocal(0);
        }
        console.log("CacheLocal instance returned")
        return CacheLocal._instance;
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        this.cache.set(key, value);
    }
}

module.exports = CacheLocal.getInstance();