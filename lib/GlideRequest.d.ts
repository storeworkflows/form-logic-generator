declare type sendRequest = (url: string, method: string, options: any) => Promise<any>;
declare function GlideRequest(sendRequest: sendRequest): {
    getAngularURL: (path: string, parameters: any) => string;
    get: (url: string, options: any) => Promise<any>;
    post: (url: string, options: any) => Promise<any>;
    put: (url: string, options: any) => Promise<any>;
    patch: (url: string, options: any) => Promise<any>;
};
export default GlideRequest;
