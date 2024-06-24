/**
 * Express API - Function to list a logs.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */
 
import LogView from "../view/log";
import { LogModel } from "../model/log";
import constants from "../constants";

const DEBUG:boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

function listLogs(api) {
    const main = () => {
        if (DEBUG) {
            api.handler.log(`listLogs()`);
        }
        return new Promise(callback => {
            try {
                let query = LogModel.getLogs();
                api.db.query(query, (error, res) => {
                    if (error) {
                        api.handler.log(`${query} -> ${error.toString()}`);
                        setTimeout(() => process.exit(), 1);
                        this.invalidRequest(error.toString(), constants.INTERNAL_ERROR)
                            .then(fout => callback(fout));
                    } else {
                        callback(this.jsonPayload(true, res.map((res) => (
                            new LogView(new LogModel(res).randomize())
                        ))));
                    }
                });
            } catch (e) {
                api.handler.throw(`listLogs() -> ${e.message}`);
                callback(api.invalidRequest(e.message, constants.INTERNAL_ERROR));
            }
        });
    }
    return main();
}

export default listLogs;