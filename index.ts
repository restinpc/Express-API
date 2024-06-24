/**
 * Express API - Index file.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

// @ts-ignore
const pid:number = process.pid > 0 ? process.pid : -1;

require('fs').writeFile('pid.txt', pid.toString(), () => {
    require('./src/script/server')(pid);
});
