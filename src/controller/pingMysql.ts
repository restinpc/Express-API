/**
 * Express API - Function to ping database.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */
 
import constants from "../constants";

const DEBUG:boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

function pingMysql(api) {
    const main = () => {
        if (DEBUG) {
            api.handler.log(`pingMysql()`);
        }
        return new Promise((callback) => {
            try {
                let query = 'SELECT 1';
                let time = new Date().valueOf();
                api.db.query(query).then((res) => {
                    if (res) {
                        api.response(true, {
                            ping: new Date().valueOf() - time
                        }).then((fout) => callback(fout));
                    }
                });
            } catch (e) {
                api.handler.throw(`pingMysql() -> ${e.message}`);
                callback(api.invalidRequest(e.message, constants.INTERNAL_ERROR));
            }
        });
    };
    return main();
}

export default pingMysql;