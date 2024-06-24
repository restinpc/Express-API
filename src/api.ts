/**
 * Express API - API container.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import {
    IApi,
    IDataSource,
    IErrorHandler,
    IDatabase
} from "./interfaces";
import constants from "./constants";

const DEBUG = process.env && process.env.DEBUG == "true" ? true : false;

class Api implements IApi {
    public db: any;
    public ip: string;
    public method: string;
    public body: string | null;
    public request: any;
    public code: number;
    public cookie: any;
    public handler: IErrorHandler;
    public dataSource: IDataSource;
    
    constructor(
        request:any,
        database:IDatabase,
        dataSource:IDataSource,
        handler:IErrorHandler,
        controller:string = "",
        callback: (fout:any, code:number, cookie?:any) => void = () => {}
    ) {
        try {
            this.handler = handler;
            this.dataSource = dataSource;
            this.ip = (
                request.headers['x-forwarded-for'] ||
                request.connection.remoteAddress ||
                request.socket.remoteAddress || (
                    request.connection.socket ?
                    request.connection.socket.remoteAddress : null
                )
            ).replace('::ffff:', '');
            this.method = request.method ? request.method : 'GET';
            this.body = request.body ? request.body : null;
            this.request = request;
            this.code = 200;
            this.cookie = null;
            this.db = database;
            if (controller) {
                if (!DEBUG) {
                    const fileName = `./controller/${controller}`;
                    const module = require(fileName);
                    if (Array.isArray(module)) {
                        module.forEach(item => {
                            if (item.name === controller) {
                                item["default"](this).then((fout) => callback(fout, this.code, this.cookie));
                            }
                        });
                    } else {
                        module["default"](this).then((fout) => callback(fout, this.code, this.cookie));
                    }
                } else {
                    const fileName = `./controller/${controller}.js`;
                    const module = require(fileName);
                    if (Array.isArray(module)) {
                        module.forEach((item) => {
                            if (item.name === controller) {
                                item["default"](this).then((fout) => callback(fout, this.code));
                            }
                        });
                    } else {
                        module["default"](this).then((fout) => callback(fout, this.code));
                    }
                }
            }
        } catch (e) {
            this.handler.throw("Api.constructor() -> " + JSON.stringify(e, Object.getOwnPropertyNames(e)));
            callback(e.message, constants.INTERNAL_ERROR);
        }
    }
    
    public defaultResponse(code:number = 200): Promise<{ status: string }>{
        this.code = code;
        return new Promise(callback => {
            try {
                callback({ status: 'ok' });
            } catch (e) {
                this.handler.throw(`Api.defaultResponse() -> ${e.message}`);
            }
        });
    };
    
    public invalidRequest(message:string|null = null, code:number = 400): Promise<string> {
        this.code = code;
        return new Promise(callback => {
            if (message) {
                callback(`${code} Bad Request - ${message}`);
            } else {
                callback(`${code} Bad Request`);
            }
        });
    };
    
    public accessDenied(): Promise<string> {
        this.code = 403;
        return new Promise(callback => {
            callback(`403 Forbidden`);
        });
    };
    
    public response(success:boolean, payLoad?:any, error?:string):Promise<string> {
        this.code = 200;
        return new Promise(callback => {
            const fout = {
                success: success ? true: false
            };
            if (payLoad) {
                // @ts-ignore
                fout.payLoad = payLoad;
            }
            if (error) {
                // @ts-ignore
                fout.error = error;
            }
            callback(JSON.stringify(fout));
        });
    };
}

export default Api;
