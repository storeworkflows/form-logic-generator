declare class GlobalStorage {
    private _wm;
    constructor();
    clear(): void;
    delete(k: object): boolean;
    get(k: object): any;
    has(k: object): boolean;
    set(k: object, v: any): this;
}
declare const _default: GlobalStorage;
export default _default;
