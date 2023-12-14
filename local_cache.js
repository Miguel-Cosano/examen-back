const NodeCache = require('node-cache');

class CacheLocal {
    static _instance;
    cache;

    constructor(ttlSeconds) {
        console.log("CacheLocal created");
        // Initialize cache only if it's not already initialized
        if (!this.cache) {
            this.cache = new NodeCache({
                stdTTL: ttlSeconds,
                checkperiod: ttlSeconds * 0.2,
                useClones: false
            });
        }
    }

    static getInstance(ttlSeconds) {
        if (!CacheLocal._instance) {
            CacheLocal._instance = new CacheLocal(ttlSeconds);
            console.log("CacheLocal instance created");
        }
        console.log("CacheLocal instance returned");
        return CacheLocal._instance;
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        this.cache.set(key, value);
    }
}

module.exports = CacheLocal.getInstance(0);