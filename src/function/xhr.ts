/**
 * Express API - XHR Request processor.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import XMLHttpRequest from "node-http-xhr";
import log from "./log";

const xhrRequest = (
    url:string,
    method:string = "GET",
    data:string|null = null,
    value:string|null = null
):Promise<string|boolean> => {
    return new Promise(callback => {
        try {
            const delay = parseInt(process.env.XHR_TIMEOUT);
            const timeout = window.setTimeout(() => callback(false), delay);
            const xhr = new XMLHttpRequest();
            xhr.timeout = delay;
            xhr.open(method, url, true);
            if (data !== null) {
                xhr.setRequestHeader(data, value);
            }
            xhr.send();
            let flag = false;
            xhr.onload = () => {
                if (xhr.status && xhr.responseText && !flag) {
                    flag = true;
                    clearTimeout(timeout);
                    callback(xhr.responseText);
                    xhr.abort();
                }
            };
            xhr.onclose = () => {
                clearTimeout(timeout);
                callback(false);
            }
        } catch (e) {
            log(`Error! Api.xhrRequest(${url}) -> ${e.message}`);
            callback(false);
        }
    });
};

module.exports = xhrRequest;