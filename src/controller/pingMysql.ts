/**
 * Express API - Function to ping database.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import log from "../function/log";
import connection from "../function/mysql";

const DEBUG = process.env && process.env.DEBUG ? true : false;

function pingMysql() {
    const main = () => {
        if (DEBUG) {
            log(`Api.pingMysql()`);
        }
        return new Promise(callback => {
            try {
                let query = 'SELECT 1';
                connection.query(query, error => {
                    if (error) {
                        log(`${query} -> ${error.toString()}`);
                        setTimeout(() => process.exit(), 1);
                        this.invalidRequest(error.toString(), 500)
                            .then((fout) => callback(fout));
                    } else {
                        this.defaultResponse().then((fout) => callback(fout));
                    }
                });
            } catch (e) {
                log(`Error! Api.pingMysql() -> ${e.message}`);
            }
        });
    };
    return main();
}

export default pingMysql;