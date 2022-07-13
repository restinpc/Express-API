/**
 * Express API - Express Server.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import env from "dotenv";
import fs from "fs";
import https, { Server, ServerOptions } from "https";
import express from "express";
import * as core from "express-serve-static-core";
import bodyParser from "body-parser";
import cors from "cors";
import API from "../api";
import log from "../function/log";
import routes from "../routes";

env.config();
const privateKey:string = fs.readFileSync('keys/ssl.key', 'utf8');
const certificate:string = fs.readFileSync('keys/ssl.crt', 'utf8');
const credentials:ServerOptions = { key: privateKey, cert: certificate };
const PORT:number = parseInt(process.env.PORT);
const app:core.Express = express();

function main() {
    let server:Server;
    try {
        app.use(cors());
        app.use(bodyParser.json());
        routes.forEach(item => {
           if (item.method === "POST") {
               app.post(item.url, (req, res) => {
                   new API(req, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   });
                })
           } else if (item.method === "GET") {
               app.get(item.url, (req, res) =>
                   new API(req, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   }));
           } else {
               app.all(item.url, (req, res) => {
                   new API(req, item.controller, (fout, code) => {
                       res.status(code).send(fout);
                   })
               });
           }
        });
        app.all('/', (req, res) => {
            res.status(404).send();
        });
        app.all('/*', (req, res) => {
            new API(req).invalidRequest().then(fout => {
                res.status(404).send(fout);
            });
        });
        server = https.createServer(credentials, app);
        server.listen(PORT, () => log(`Starting API server at port ${PORT}`));
    } catch (e) {
        log(`Fatal error -> ${e.message}`);
        try {
            server.close();
        } catch (e) {
            log(`Server wasn't ever started`);
        }
        log(`Restarting server...`);
        setTimeout(main, 1);
        return 0;
    }
}

module.exports = main;