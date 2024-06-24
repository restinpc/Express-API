/**
 * Express API - Function to test error tracing.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

const DEBUG:boolean = process.env && process.env.DEBUG && process.env.DEBUG == "true";

function throwError(api) {
    const main = () => {
        if (DEBUG) {
            api.handler.log(`throwError()`);
        }
        return new Promise((callback) => {
            try {
                throw(new Error("Test exception"));
            } catch (e) {
                api.handler.throw(`throwError() -> ${e.message}`);
                callback(api.defaultResponse());
            }
        });
    };
    return main();
}

export default throwError;