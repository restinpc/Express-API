/**
 * Express API - Function to list a logs.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import log from "../function/log";
import connection from "../function/mysql";
import LogView from "../view/log";
import { LogModel } from "../model/log";

const DEBUG = process.env && process.env.DEBUG ? true : false;

function listLogs() {
    const main = () => {
        if (DEBUG) {
            log(`Api.listLogs()`);
        }
        return new Promise(callback => {
            try {
                let query = LogModel.getLogs();
                connection.query(query, (error, res) => {
                    if (error) {
                        log(`${query} -> ${error.toString()}`);
                        setTimeout(() => process.exit(), 1);
                        this.invalidRequest(error.toString(), 500)
                            .then(fout => callback(fout));
                    } else {
                        callback(this.jsonPayload(true, res.map((res) => (
                            new LogView(new LogModel(res).randomize())
                        ))));
                    }
                });
            } catch (e) {
                log(`Error! Api.listLogs() -> ${e.message}`);
            }
        });
    }
    return main();
}

export default listLogs;