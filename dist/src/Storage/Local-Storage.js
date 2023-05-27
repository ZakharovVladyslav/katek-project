class CustomStorage {
    constructor() {
        Object.defineProperty(this, "_core", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!CustomStorage._core) {
            CustomStorage._core = {};
        }
        this._core = CustomStorage._core;
        window.CustomStorage = this;
    }
    get items() {
        return this._core;
    }
    setItem(prop, value) {
        this._core[prop] = value;
    }
    clearStorage() {
        this._core = {};
    }
}
Object.defineProperty(CustomStorage, "_core", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {}
});
export default CustomStorage;
