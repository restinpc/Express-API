/**
 * Express API - Function to sign in user.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import md5 from "md5";
import crypt from "../function/crypt";
import UserModel from "../model/user";
import constants from "../constants";

const DEBUG:boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

function loginUser(api) {
    const main = () => {
        if (DEBUG) {
            api.handler.log(`loginUser(${JSON.stringify(api.body)})`);
        }
        return new Promise(callback => {
            try {
                if (!api.body.pass || !api.body.email) {
                    callback(api.invalidRequest('Invalid arguments'));
                } else {
                    const email = api.body.email
                        .toString()
                        .trim()
                        .toLowerCase()
                        .replace(/"/g, '');
                    const password = api.body.pass.toString().trim();
                    let query = UserModel.getUserByEmail(email);
                    api.db.query(
                        query,
                        (error, results) => {
                            if (error) {
                                api.handler.error(`${query} -> ${error.toString()}`);
                                api.invalidRequest(error.toString()).then(fout => callback(fout));
                            } else {
                                if (results.length > 0) {
                                    const decrypted = crypt.decrypt_password(
                                        results[0].password,
                                        results[0].salt
                                    );
                                    if (password === decrypted) {
                                        const sid = md5(Date.now() * Math.random());
                                        query = UserModel.updateUserSessionID(parseInt(results[0].id), sid);
                                        api.db.query(
                                            query,
                                            (error) => {
                                                if (error) {
                                                    api.handler.error(`${query} -> ${error.toString()}`);
                                                    api.invalidRequest(error.toString())
                                                        .then(fout => callback(fout));
                                                } else {
                                                    const user = {
                                                        name: results[0].name,
                                                        email: results[0].email,
                                                        magic: results[0].salt,
                                                        sid: sid,
                                                    };
                                                    api.cookie = {
                                                        name: "sid",
                                                        value: sid
                                                    };
                                                    callback(api.jsonPayload(true, user));
                                                }
                                            }
                                        );
                                    } else {
                                        callback(
                                            api.jsonPayload(
                                                false,
                                                {},
                                                "Invalid password"
                                            )
                                        );
                                    }
                                } else {
                                    callback(
                                        api.jsonPayload(
                                            false,
                                            {},
                                            "Invalid email address"
                                        )
                                    );
                                }
                            }
                        }
                    );
                }
            } catch (e) {
                api.handler.throw(`loginUser(${JSON.stringify(api.body)}) -> ${e.message}`);
                callback(api.invalidRequest(e.message, constants.INTERNAL_ERROR));
            }
        });
    }
    return main();
}

export default loginUser;