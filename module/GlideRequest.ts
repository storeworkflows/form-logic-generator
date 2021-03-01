import {encodeURIParameters} from "./utils/http";
import _ from "lodash";

class GlideRequest {
    private sendRequest: any;

    private static applyOptions(method: string, url: string, options: any) {
        let fetchOptions = {
            ...options,
            method: method,
            url: url
        };
        let {data, dataType} = fetchOptions;

        switch (method) {
            case 'get':
                if (data) {
                    // @note: quick and dirty param concat
                    const params = encodeURIParameters(data);
                    if (url.indexOf('?') !== -1)
                        fetchOptions.url = url + '&' + params;
                    else fetchOptions.url = url + '?' + params;
                }
                break;
            default:
                if (dataType === 'xml')
                    fetchOptions.body = encodeURIParameters(data);
                else fetchOptions.body = data;
                break;
        }

        switch (dataType) {
            default:
            case 'json':
                fetchOptions.headers = {
                    Accept: 'application/json, text/javascript',
                    'Content-Type': 'application/json',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
            case 'xml':
                fetchOptions.headers = {
                    Accept: 'application/xml, text/xml',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
        }
        return fetchOptions;
    }

    private requestFactory(method: string, url: string, options: any) {
        if (!url) {
            throw 'Must specify a URL';
        }
        const fetchOptions = GlideRequest.applyOptions(method, url, options);
        return this.sendRequest(fetchOptions.url, method, fetchOptions);
    }


    private static getAngularURL(path: string, parameters: any) {
        return (
            '/angular.do?sysparm_type=' +
            path +
            '&' +
            (parameters ? encodeURIParameters(parameters) : '')
        );
    }


    private get(url: string, options: any) {
        return this.requestFactory(url, 'get', options)
    }

    private post(url: string, options: any) {
        if (!url) {
            throw 'Must specify a URL';
        }
        const fetchOptions = GlideRequest.applyOptions('post', url, options);
        return this.sendRequest(fetchOptions.url, 'post', fetchOptions).then(
            (response: any) => {
                /* for glideAjax */
                let type = fetchOptions.dataType;
                response.type = type;
                response.responseText = response.data;
                response.responseXML =
                    type === 'xml'
                        ? _.get(response, 'request.responseXML', null)
                        : null;
                return response;
            },
            (response: any) => {
                return response;
            }
        );
    }

    private put(url: string, options: any) {
        return this.requestFactory(url, "put", options);
    }

    private patch(url: string, options: any) {
        return this.requestFactory(url, "patch", options);
    }

    getFactory({sendRequest}: any) {
        this.sendRequest = sendRequest;

        return {
            getAngularURL: GlideRequest.getAngularURL,
            get: this.get,
            post: this.post,
            put: this.put,
            patch: this.patch
        }
    };
}

export default new GlideRequest()