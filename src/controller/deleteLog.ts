/**
 * Express API - Function to delete a log entity.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import UserModel from "../model/user";
import { LogModel } from "../model/log";
import constants from "../constants";

const DEBUG:boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

function deleteLog(api) {
    const main = () => {
        if (DEBUG) {
            api.handler.log(`deleteLog(${JSON.stringify(api.body)})`);
        }
        return new Promise((callback) => {
            try {
                if (api.request && api.request.headers && api.request.headers.sid) {
                    const sid = api.request.headers.sid.toString();
                    let query = UserModel.getUserBySessionID(sid);
                    api.db.query(query, (error, res) => {
                        if (error || !res.length) {
                            api.invalidRequest(error ? error.toString() : "Error", constants.INTERNAL_ERROR)
                                .then(fout => callback(fout));
                        } else {
                            const id = parseInt(api.body.id, 10);
                            query = LogModel.deleteLog(id);
                            api.db.query(query, error => {
                                if (error) {
                                    api.handler.log(`${query} -> ${error.toString()}`);
                                    setTimeout(() => process.exit(), 1);
                                    api.invalidRequest(error.toString(), constants.INTERNAL_ERROR)
                                        .then(fout => callback(fout));
                                } else {
                                    callback(api.jsonPayload(true, { success: true }));
                                }
                            });
                        }
                    });
                } else {
                    api.invalidRequest("Session ID is not defined", constants.INTERNAL_ERROR)
                        .then(fout => callback(fout));
                }
            } catch (e) {
                api.handler.throw(`deleteLog() -> ${e.message}`);
                callback(api.invalidRequest(e.message, constants.INTERNAL_ERROR));
            }
        });
    }
    return main();
}

export default deleteLog;