/**
 * Express API - API container.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import log from "./function/log";

const DEBUG = process.env && process.env.DEBUG ? true : false;

class Api {
    remote_addr: string;
    method: string;
    body: string | null;
    request: any;
    code: number;
    cookie: any;
    constructor(
        req:any,
        method:string = "GET",
        callback: (fout:any, code:number, cookie?:any) => void = () => {}
    ) {
        try {
            this.remote_addr =(
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress || (
                    req.connection.socket ?
                    req.connection.socket.remoteAddress : null
                )
            ).replace('::ffff:', '');
            this.method = req.method ? req.method : 'GET';
            this.body = req.body ? req.body : null;
            this.request = req;
            this.code = 200;
            this.cookie = null;
            if (method) {
                if (!DEBUG) {
                    const fileName = `./controller/${method}.js`;
                    const module = require(fileName);
                    if (Array.isArray(module)) {
                        module.forEach(item => {
                            if (item.name === method) {
                                item["default"].call(this, this)
                                    .then(fout => callback(fout, this.code, this.cookie));
                            }
                        });
                    } else {
                        module["default"].call(this, this)
                            .then(fout => callback(fout, this.code, this.cookie));
                    }
                } else {
                    const fileName = `./controller/${method}.js`;
                    const module = require(fileName);
                    if (Array.isArray(module)) {
                        module.forEach(item => {
                            if (item.name === method) {
                                item["default"].call(this, this)
                                    .then(fout => callback(fout, this.code));
                            }
                        });
                    } else {
                        module["default"].call(this, this)
                            .then(fout => callback(fout, this.code));
                    }
                }
            }
        } catch (e) {
            log("Error! Api.constructor -> " + JSON.stringify(e, Object.getOwnPropertyNames(e)));
        }
    }

    /**
     * Empty Request processor.
     *
     * @return {Promise}
     */
    defaultResponse(code:number = 200): Promise<{ status: string }>{
        this.code = code;
        return new Promise(callback => {
            try {
                callback({ status: 'ok' });
            } catch (e) {
                log(`Error! Api.defaultResponse() -> ${e.message}`);
            }
        });
    };

    /**
     * Invalid Request processor.
     *
     * @return {Promise}
     */
    invalidRequest(message:string|null = null, code:number = 400): Promise<string> {
        this.code = code;
        return new Promise(callback => {
            try {
                if (message) {
                    callback(`400 Bad Request - ${message}`);
                } else {
                    callback(`400 Bad Request`);
                }
            } catch (e) {
                log(`Error! Api.invalidRequest() -> ${e.message}`);
            }
        });
    };

    /**
     * Access Denied method.
     *
     * @return {Promise}
     */
    accessDenied(): Promise<string> {
        this.code = 403;
        return new Promise(callback => {
            try {
                callback(`403 Forbidden`);
            } catch (e) {
                log(`Error! Api.accessDenied() -> ${e.message}`);
            }
        });
    };

    /**
     * JSON Payload
     *
     * @return {String}
     */
    jsonPayload(success:boolean, payLoad:any, error_message?:string):string {
        try {
            const fout = {
                success: success ? true: false,
                payLoad: payLoad,
                timeStamp: new Date().toUTCString(),
                error: !error_message ? null : {
                    message: error_message
                }
            };
            return JSON.stringify(fout);
        } catch (e) {
            log(`Error! Api.jsonPayload() -> ${e.message}`);
        }
    };
}

export default Api;
