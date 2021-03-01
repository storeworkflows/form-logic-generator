class GlobalStorage {
    private _wm: WeakMap<object, any>;

    constructor() {
        this._wm = new WeakMap();
    }

    clear() {
        this._wm = new WeakMap()
    }
    delete(k: object) {
        return this._wm.delete(k)
    }
    get(k: object) {
        return this._wm.get(k)
    }
    has(k: object) {
        return this._wm.has(k)
    }
    set(k: object, v: any) {
        this._wm.set(k, v)
        return this
    }
}

export default new GlobalStorage()