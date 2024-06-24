/**
 * Express API - AES hashing functions.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import CryptoJS from "crypto-js";
import md5 from "md5";
import { IAESData } from "../interfaces";

class Crypt {
    static function(pass:string):boolean {
        const encrypted:IAESData = this.encrypt_password(pass);
        const decrypted:string = this.decrypt_password(encrypted.password, encrypted.hash);
        return pass === decrypted;
    };

    static encrypt_password(password:string, hash:string|null = null):IAESData {
        if (hash === null) {
            hash = md5(Date.now() / Math.random());
        }
        const data:string = `${ process.env.AES_PREFIX }${ md5(hash) }${ process.env.AES_POSTFIX }`;
        return {
            password: CryptoJS.AES.encrypt(password, data).toString(),
            hash: hash
        };
    };

    static decrypt_password(password:string, hash:string):string {
        const data:string = `${ process.env.AES_PREFIX }${ md5(hash) }${ process.env.AES_POSTFIX }`;
        return CryptoJS.AES.decrypt(password, data).toString(CryptoJS.enc.Utf8);
    };
}
export default Crypt;