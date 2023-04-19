let _instance = null;

export default class Controller {
    static get instance() {
        return _instance ? _instance : _instance = new Controller();
    }

    constructor() {
        this._core = {};
        window.Controller = this;
    }

    get core() {
        return this._core;
    }

    editCore(prop, value) {
        this._core[prop] = value;
    }

    foo(prop, value) {
        let todo = 1 + value;
        this.editCore(prop, todo);
    }
}
