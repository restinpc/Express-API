/**
 * Express API - Index file.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

const DEBUG = process.env && process.env.DEBUG ? true : false;
const PID:number = process.pid > 0 ? process.pid : -1;

require('fs').writeFile('pid.txt', PID.toString(), () => {
    console.log(`DEBUG = ${ DEBUG }`);
    console.log(`PID = ${ PID }`);
    require('./src/script/server.js')();
});
