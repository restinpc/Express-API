/**
 * Express API - Timestamped log tool.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

const log = (text:string):void => {
    console.log(`${new Date().toISOString()}: ${text}`);
};

export default log;