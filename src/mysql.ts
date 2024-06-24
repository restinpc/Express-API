/**
 * Express API - MySQL connection.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import mysql from "mysql";
import {IDatabase} from "./interfaces";

class db implements IDatabase {
    pool;
    connection;
    
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: process.env.MYSQL_CONNECTIONS,
            timeout: process.env.MYSQL_TIMEOUT,
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        });
        this.connect();
    }
    
    connect():void {
        this.pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
                this.reconnect();
            } 
            this.connection = connection;
        });
    }
    
    reconnect():void {
        if (this.connection) {
            this.connection.end();
        }
        setTimeout(() => {
            this.connect();
        }, 10000);
    }
    
    public async query(request:string):Promise<any> {
        try {
            return new Promise((callback, reject) => {
                this.connection.query(request, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        this.reconnect();
                        reject();
                    }  else {
                        callback(results);
                    }
                });
            });
        } catch(e) {
            console.error(e.message);
            this.reconnect();
        }
    }
}

export default db;