/* eslint-disable @typescript-eslint/no-explicit-any */
class CustomStorage {
    constructor() {
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
CustomStorage._core = {};
export default CustomStorage;
