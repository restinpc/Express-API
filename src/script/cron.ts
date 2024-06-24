/**
 * Express API - 1M interval cron process controller.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import XMLHttpRequest from "node-http-xhr";
import { exec } from "child_process";
import fs from "fs";
import env from "dotenv";
import mysql from "../mysql";
import constants from "../constants";
import { LogModel } from "../model/log";

env.config();
let flag:boolean = false;
const db = new mysql();

const restart = (code:string|number):void => {
    if (!flag) {
        console.log(`Cron.restart(${code})`);
        flag = true;
        fs.readFile('pid.txt', 'utf8', (err:any, contents:string) => {
            let command:string = `kill ${ parseInt(contents) }`;
            console.log(command);
            try {
                exec(command);
            } catch (e) { }
            command = process.env.SHELL_SCRIPT;
            console.log(command);
            exec(command);
        });
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
                    const json = require("../../package");
                    if (xhr.responseText != json.version) {
                        let query:string = LogModel.insertQuery(0, 'restart', 'Server stop respond');
                        db.query(query);
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