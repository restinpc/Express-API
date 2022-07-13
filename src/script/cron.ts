/**
 * Express API - 1M interval cron process controller.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import XMLHttpRequest from "node-http-xhr";
import { exec } from "child_process";
import fs from "fs";
import env from "dotenv";
import constants from "../constants";
import connection from "../function/mysql";
import log from "../function/log";
import { LogModel } from "../model/log";

env.config();
let flag:boolean = false;

const restart = (code:string|number):void => {
    if (!flag) {
        log(`Cron.restart(${code})`);
        flag = true;
        fs.readFile('pid.txt', 'utf8',
            (err:any, contents:string) => {
                let command:string = `kill ${ parseInt(contents) }`;
                log(command);
                try {
                    exec(command);
                } catch (e) { }
                command = process.env.SHELL_SCRIPT;
                log(command);
                exec(command);
            }
        );
    }
};

const selfcheck = ():void => {
    console.log("Cron.selfcheck()");
    try {
        let xhr:any = new XMLHttpRequest();
        xhr.open("GET", process.env.STATUS_URL);
        xhr.send();
        xhr.onerror = () => {
            restart(1);
            xhr.abort();
        };
        xhr.onreadystatechange = () => {
            try {
                if (xhr.status !== constants.HTTP_OK.value) {
                    restart(2);
                } else if (xhr.responseText) {
                    if (xhr.responseText !== '{"status":"ok"}') {
                        let query:string = LogModel.insertQuery(0, 'restart', 'Server stop respond');
                        connection.query(query);
                        restart(JSON.stringify(xhr));
                    } else {
                        process.exit(1);
                    }
                }
            } catch (e) {
                restart(4);
            }
        };
    } catch (e) {
        restart(5);
    }
}

try {
    setTimeout(() => process.exit(0), 50000);
    selfcheck();
} catch (e) {
    process.exit(0);
}