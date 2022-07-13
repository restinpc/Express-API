/**
 * Express API - Endpoint routes.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

const routes = [
    {
        url: "/ping",
        method: "GET",
        controller: "pingMysql"
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