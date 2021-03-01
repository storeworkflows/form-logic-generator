declare class GlideRequest {
    private sendRequest;
    private static applyOptions;
    private requestFactory;
    private static getAngularURL;
    private get;
    private post;
    private put;
    private patch;
    getFactory({ sendRequest }: any): {
        getAngularURL: typeof GlideRequest.getAngularURL;
        get: (url: string, options: any) => any;
        post: (url: string, options: any) => any;
        put: (url: string, options: any) => any;
        patch: (url: string, options: any) => any;
    };
}
declare const _default: GlideRequest;
export default _default;
