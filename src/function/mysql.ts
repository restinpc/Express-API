/**
 * Express API - MySQL connection.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import mysql from "mysql";

const conf = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "mysql_api"
};

const connection = mysql.createConnection(conf);
connection.setTimeout(parseInt(process.env.MYSQL_TIMEOUT, 10));
connection.connect();

export default connection;