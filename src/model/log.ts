/**
 * Express API - Log entity model.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import { ILogModel, IRandom } from "../interfaces";

export class LogModel implements ILogModel {
    id: number;
    node_id: number;
    action: string;
    message: string;
    date: Date;
    constructor(props) {
        ((props, values:string[]) => values.forEach(
            // @ts-ignore
            (value) => this[value] = props[value])
        )(props, [
            `id`,
            `node_id`,
            `action`,
            `message`,
            `date`
        ]);
    }

    randomize(): RandomLogModel {
        return new RandomLogModel(this);
    }

    static insertQuery(node_id:number, action:string, message:string):string {
        return `
            INSERT INTO mysql_log(node_id, action, message, date)
            VALUES(
                ${node_id}, 
                "${action.replace(/"/g, '\\\"')}", 
                "${message.replace(/"/g, '\\\"')}", 
                NOW()
            )
        `;
    }

    static getLogs():string {
        return `SELECT * FROM mysql_log ORDER BY id DESC LIMIT 0, 1000`;
    }

    static deleteLog(id:number):string {
        return `DELETE FROM mysql_log WHERE id = ${id}`;
    }
}

export class RandomLogModel extends LogModel implements IRandom {
    random: number;
    constructor(props) {
        super(props);
        this.random = Math.random();
    }
}