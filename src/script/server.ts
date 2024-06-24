/**
 * Express API - Express Server.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import env from "dotenv";
import fs from "fs";
import https, { Server, ServerOptions } from "https";
import express from "express";
import * as core from "express-serve-static-core";
import bodyParser from "body-parser";
import cors from "cors";
import ip from "ip";
import API from "../api";
import routes from "../routes";
import Mysql from "../mysql";
import ErrorHandler from "../errorHandler";
import DataSource from "../dataSource";
import {
    IDataSource,
    IErrorHandler,
    IDatabase
} from "../interfaces";
import constants from "../constants";

env.config();
const privateKey:string = fs.readFileSync('keys/ssl.key', 'utf8');
const certificate:string = fs.readFileSync('keys/ssl.crt', 'utf8');
const credentials:ServerOptions = { key: privateKey, cert: certificate };
const PORT:number = parseInt(process.env.PORT);
const app:core.Express = express();

async function main(pid:number = 0) {
    const db:IDatabase = new Mysql();
    const dataSource:IDataSource = new DataSource();
    const handler:IErrorHandler = new ErrorHandler(dataSource);
    dataSource.setHandler(handler);
    let server:Server;
    try {
        app.use(cors());
        app.use(bodyParser.json());
        routes.forEach(item => {
           if (item.method === "POST") {
               app.post(item.url, (req, res) => {
                   new API(req, db, dataSource, handler, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   });
                })
           } else if (item.method === "GET") {
               app.get(item.url, (req, res) =>
                   new API(req, db, dataSource, handler, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   }));
           } else {
               app.all(item.url, (req, res) => {
                   new API(req, db, dataSource, handler, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   })
               });
           }
        });
        app.all('/', (req, res) => {
            const json = require("../../package.json");
            res.status(200).send(json.version);
        });
        app.all('/*', (req, res) => {
            new API(req, db, dataSource, handler).invalidRequest().then(fout => {
                res.status(constants.NOT_FOUND).send(fout);
            });
        });
        server = https.createServer(credentials, app);
        server.listen(PORT, () => handler.log(`Server is starting at https://${ip.address()}:${PORT}`));
    } catch (e) {
        handler.throw(`Server.main() -> ${e.message}`);
        try {
            server.close();
        } catch (e) {
            handler.error(`Server wasn't started`);
        }
        handler.log(`Server is restarting now...`);
        setTimeout(main, 1);
        return 0;
    }
}

module.exports = main;