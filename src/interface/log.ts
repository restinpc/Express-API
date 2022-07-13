/**
 * Express API - Log entity interfaces.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

interface ILogModel {
    id: number,
    node_id: number,
    action: string,
    message: string,
    date: Date
}

interface ILogView {
    id: number,
    action: string,
    message: string,
    date: Date,
    random: number,
}

interface IRandom {
    random: number;
}

export {
    ILogModel,
    IRandom,
    ILogView
};