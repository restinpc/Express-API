/**
 * Express API - Function to sign in user.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import md5 from "md5";
import connection from "../function/mysql";
import log from "../function/log";
import crypt from "../function/crypt";
import UserModel from "../model/user";

const DEBUG = process.env && process.env.DEBUG ? true : false;

function loginUser() {
    const main = () => {
        if (DEBUG) {
            log(`Api.loginUser(${ JSON.stringify(this.body) })`);
        }
        return new Promise(callback => {
            try {
                if (!this.body.pass || !this.body.email) {
                    callback(this.invalidRequest('Invalid arguments'));
                } else {
                    const email = this.body.email
                        .toString()
                        .trim()
                        .toLowerCase()
                        .replace(/"/g, '');
                    const password = this.body.pass.toString().trim();
                    let query = UserModel.getUserByEmail(email);
                    connection.query(
                        query,
                        (error, results) => {
                            if (error) {
                                log(`${query} -> ${error.toString()}`);
                                this.invalidRequest(error.toString()).then(fout => callback(fout));
                            } else {
                                if (results.length > 0) {
                                    const decrypted = crypt.decrypt_password(
                                        results[0].password,
                                        results[0].salt
                                    );
                                    if (password === decrypted) {
                                        const sid = md5(Date.now() * Math.random());
                                        query = UserModel.updateUserSessionID(parseInt(results[0].id), sid);
                                        connection.query(
                                            query,
                                            (error) => {
                                                if (error) {
                                                    log(`${query} -> ${error.toString()}`);
                                                    this.invalidRequest(error.toString())
                                                        .then(fout => callback(fout));
                                                } else {
                                                    const user = {
                                                        name: results[0].name,
                                                        email: results[0].email,
                                                        magic: results[0].salt,
                                                        sid: sid,
                                                    };
                                                    this.cookie = {
                                                        name: "sid",
                                                        value: sid
                                                    };
                                                    callback(this.jsonPayload(true, user));
                                                }
                                            }
                                        );
                                    } else {
                                        callback(
                                            this.jsonPayload(
                                                false,
                                                {},
                                                "Invalid password"
                                            )
                                        );
                                    }
                                } else {
                                    callback(
                                        this.jsonPayload(
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
                log(`Error! Api.loginUser(${JSON.stringify(this.body)}) -> ${e.message}`);
            }
        });
    }
    return main();
}

export default loginUser;