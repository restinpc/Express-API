/**
 * Express API - Primary data factory.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */
 
 import XMLHttpRequest from "node-http-xhr";
 import { spawnSync } from "child_process";
 import {
    IApi,
    IDataSource,
    IErrorHandler
} from "./interfaces";

export default class DataSource implements IDataSource {
    url: string;
    data: any;
    request: string;
    errorState: number;
    requeries: number;
    timeout: number;
    domain: string;
    handler: IErrorHandler;
    
    constructor() {
        this.url = process.env.API_URL;
        this.data = {};
        this.request = "";
        this.errorState = 0;
        this.domain = "";
        this.requeries = 3;
        this.timeout = parseInt(process.env.REQUEST_TIMEOUT) * 1000;
    }
    
    public setHandler(handler: IErrorHandler):void {
        this.handler = handler;
    }

    /**
     * Primary XHR method wrapper.
     * @param url
     * @param method
     * @param body
     * @param func
     * @param strict
     * @param requery
     */
    public submitRequest(
        url: string,
        method: string,
        body: string,
        func: (func: any) => void,
        strict: boolean = true,
        requery: boolean = true
    ): Promise<string | void> {
        return new Promise((callback) => {
            this.handler.log(`DataSource.submitRequest(${url}, ${method})`);
            try {
                let xhr = new XMLHttpRequest();
                if (url.indexOf('http') < 0) {
                    xhr.open(method, this.url + url, true);
                } else {
                    xhr.open(method, url, true);
                }
                xhr.timeout = this.timeout;
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.send(body);
                let flag = false;
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return false;
                    }
                    if (!flag) {
                        flag = true;
                        if (xhr.status !== 200 && xhr.status !== 400 && xhr.status !== 402) {
                            this.handler.error(
                                "DataSource.submitRequest(url=" + url + ")" +
                                ".xhr(status=" + xhr.status + ") -> " + xhr.statusText
                            );
                            if (strict) {
                                this.handler.error(xhr.responseText);
                                throw(xhr.responseText);
                            } else if (requery && ++this.errorState < this.requeries) {
                                this.submitRequest(url, method, body, func, strict, requery).then(() => callback(null));
                            } else {
                                callback(false);
                            }
                        } else {
                            this.errorState = 0;
                            callback(xhr.responseText);
                        }
                    }
                };
            } catch (e) {
                if (strict) {
                    this.handler.error("DataSource.submitRequest(url=" + url + ") -> " + e.message);
                    throw(e.message);
                } else if (++this.errorState < this.requeries) {
                    this.submitRequest(url, method, body, func).then(() => callback(null));
                } else {
                    callback(false);
                }
            }
        }).then(xhr => func(xhr));
    }

    /**
     * Init method.
     */
    public init(): Promise<{}> {
        return new Promise((callback) => {
            this.handler.log("DataSource.init()");
            try {
                setTimeout(() => {
                    callback({
                        image: {
                            selected: "",
                            //@ts-ignore
                            options: ["Image 1", "Image 2"]
                        },
                        dataType: {
                            selected: "",
                            //@ts-ignore
                            options: {
                                1: "Option 1",
                                2: "Option 2"
                            }
                        },
                    })
                }, 300);
            } catch (e) {
                this.handler.error("DataSource.ping() -> " + e.message);
            }
        });
    }

    /**
     * Ping method.
     */
    public ping(): Promise<string | boolean> {
        return new Promise((callback) => {
            this.handler.log("DataSource.ping()");
            try {
                this.submitRequest("ping", "GET", null, (response) => {
                    const data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    } else {
                        callback(false);
                    }
                });
            } catch (e) {
                this.handler.error("DataSource.ping() -> " + e.message);
            }
        });
    }

    /**
     * POST Method.
     * @param id
     */
    public post(id:number): Promise<string | boolean> {
        return new Promise((callback) => {
            this.handler.log(`DataSource.post(${id})`);
            try {
                const data = { id };
                this.submitRequest("share", "POST", JSON.stringify(data), (response) => {
                    const data = JSON.parse(response);
                    if (data && data.payLoad) {
                        callback(data.payLoad);
                    } else {
                        callback(false);
                    }
                });
            } catch (e) {
                this.handler.error("DataSource.post() -> " + e.message);
            }
        });
    }
    
    public submitTraceStack(text:string): Promise<boolean> {
        return new Promise((callback) => {
            this.handler.log(`DataSource.submitTraceStack()`);
            try {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                const appData = import("../package.json");
                let xhr = new XMLHttpRequest();
                xhr.timeout = 60000;
                xhr.open("POST", process.env.ERROR_HANDLER, true);
                xhr.setRequestHeader("Cache-Control", "no-cache");
                xhr.setRequestHeader("Content-Type", "text/json; charset=utf-8");
                xhr.send(
                    JSON.stringify({
                        agent: spawnSync( "node", ["--version"] ).stdout.toString(),
                        // @ts-ignore
                        app: appData.name,
                        // @ts-ignore
                        version: appData.version,
                        text: text
                    })
                );
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return false;
                    }
                    if (xhr.status !== 200) {
                        this.handler.error("Error submitting debug information to black box server -> "+xhr.status);
                    } else {
                        this.handler.log("Debug information successfully submitted to black box server!");
                    }
                };
            } catch (e) {
                this.handler.error("DataSource.submitTraceStack() -> " + e.message);
            }
        });
    }
}