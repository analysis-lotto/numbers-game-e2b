class PrivateSingleton {
    constructor() {
        this.message = 'I am an instance';
        this.flag = false;
    }

    start() {
        this.flag = true;

    }

    stop() {
        this.flag = false;


    }

    check () {
        return this.flag;
    }
}
class Instance {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }
    static getInstance() {
        if (!Instance.instance) {
            Instance.instance = new PrivateSingleton();
        }
        return Instance.instance;
    }

    
}

module.exports = Instance;