/**
 * Express API - Unit tests autoloader.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import fs from "fs";

try {
    fs.readdir('./src/test', function(err, items) {
        items.forEach(item => {
            if (item.indexOf('.test') > 0) {
                try {
                    require("./src/test/"+item)().then(result => {
                        if (!result) {
                            console.error(item + " contain an errors");
                        } else {
                            console.log(item + " is ok");
                        }
                    });
                } catch (e) {
                    console.error(e.message);
                }
            }
        })
    });
} catch (e) {
    console.error(e.message);
}