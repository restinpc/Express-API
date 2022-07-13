/**
 * Express API - Function to delete a log entity.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import log from '../function/log'
import connection from "../function/mysql";
import UserModel from "../model/user";
import { LogModel } from "../model/log";

const DEBUG = process.env && process.env.DEBUG ? true : false;

function deleteLog() {
    const main = () => {
        if (DEBUG) {
            log(`Api.deleteLog(${JSON.stringify(this.body)})`);
        }
        return new Promise((callback) => {
            try {
                if (this.request && this.request.headers && this.request.headers.sid) {
                    const sid = this.request.headers.sid.toString();
                    let query = UserModel.getUserBySessionID(sid);
                    connection.query(query, (error, res) => {
                        if (error || !res.length) {
                            this.invalidRequest(error ? error.toString() : "Error", 500)
                                .then(fout => callback(fout));
                        } else {
                            const id = parseInt(this.body.id, 10);
                            query = LogModel.deleteLog(id);
                            connection.query(query, error => {
                                if (error) {
                                    log(`${query} -> ${error.toString()}`);
                                    setTimeout(() => process.exit(), 1);
                                    this.invalidRequest(error.toString(), 500)
                                        .then(fout => callback(fout));
                                } else {
                                    callback(this.jsonPayload(true, { success: true }));
                                }
                            });
                        }
                    });
                } else {
                    this.invalidRequest("Session ID is not defined", 500)
                        .then(fout => callback(fout));
                }
            } catch (e) {
                log(`Error! Api.deleteLog() -> ${e.message}`);
            }
        });
    }
    return main();
}

export default deleteLog;