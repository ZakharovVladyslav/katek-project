export class CustomStorage {
    constructor() {
        if (!CustomStorage._core)
            CustomStorage._core = {};

        this._core = CustomStorage._core;
        window.CustomStorage = this;
    }

    get core() {
        return this._core;
    }

    editCore(prop, value) {
        this._core[prop] = value;
    }
}

export class SecondaryStorage {
    constructor() {
        if (!SecondaryStorage._core)
            SecondaryStorage._core = {}

        this._core = SecondaryStorage._core;
        window.SecondaryStorage = this;
    }

    get core() {
        return this._core;
    }

    editCore(prop, value) {
        this._core[prop] = value;
    }
}
