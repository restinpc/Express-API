/**
 * Express API - Log object view.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

import { ILogView } from "../interfaces";

class LogView implements ILogView {
    id: number;
    action: string;
    message: string;
    date: Date;
    random: number;
    constructor(props) {
        ((props, values:string[]) => values.forEach(
            // @ts-ignore
            (value) => this[value] = props[value])
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