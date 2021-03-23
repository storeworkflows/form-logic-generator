export declare const http: any;
export declare function sendRequestFactory(): (url: string, method: string, options: any) => Promise<unknown>;
/**
 * Encodes the provided parameter object key/values
 * @param {Object} parameters
 * @returns {String} param=value&param2=value2...
 */
export declare function encodeURIParameters(obj: any): string;
