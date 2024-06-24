/**
 * Express API - Application constants.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import Enum from "enum";

export default new Enum({
    HTTP_OK: 200,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
});