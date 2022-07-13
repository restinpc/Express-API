/**
 * Express API - API restarter.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

const XMLHttpRequest = require("node-http-xhr");
const { exec } = require('child_process');
const fs = require('fs');

let flag = false;
const restart = (code) => {
    if (!flag) {
        console.log(`${new Date().toISOString()}: ${code}`);
        flag = true;
        fs.readFile('pid.txt', 'utf8', (err, contents) => {
            let command = `kill ${parseInt(contents)+1}`;
            console.log(`${new Date().toISOString()}: ${command}`);
            try {
                exec(command);
            } catch (e) { }
            command = 'cd /home/api && node dist/index.js > logs/index.log 2> logs/index.error &';
            console.log(`${new Date().toISOString()}: ${command}`);
            exec(command);
        });
    }
};

try {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", process.env.APP_CRON_URL, true);
    xhr.send();
    xhr.onerror = () => {
        restart(1);
        xhr.abort();
    };
    xhr.onreadystatechange = () => {
        try {
            if (xhr.status != 200) {
                restart(2);
            } else if (xhr.responseText) {
                if (xhr.responseText !== '{"status":"ok"}') {
                    restart(JSON.stringify(xhr));
                }
            }
        } catch (e) {
            restart(4);
        }
    };
} catch (e) {
    restart(5);
}