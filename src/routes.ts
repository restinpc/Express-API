/**
 * Express API - Endpoint routes.
 *
 * 1.0.0 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

const routes = [
    {
        url: "/ping",
        method: "GET",
        controller: "pingMysql"
    },
    {
        url: "/error",
        method: "GET",
        controller: "throwError"
    },
    {
        url: "/delete",
        method: "POST",
        controller: "deleteLog"
    },
    {
        url: "/list",
        method: "GET",
        controller: "listLogs"
    },
    {
        url: "/login",
        method: "POST",
        controller: "loginUser"
    },
];

export default routes;