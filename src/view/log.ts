/**
 * Express API - Log object view.
 *
 * 1.0.0 # Aleksandr Vorkunov <developing@nodes-tech.ru>
 */

import { ILogView } from "../interface/log";

class LogView implements ILogView {
    id: number;
    action: string;
    message: string;
    date: Date;
    random: number;
    constructor(props) {
        ((props, values:string[]) =>
            values.forEach((value) =>
                this[value] = props[value])
        )(props, [
            `id`,
            `action`,
            `message`,
            `date`,
            `random`
        ]);
    }
}

export default LogView;