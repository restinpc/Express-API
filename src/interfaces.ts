/**
 * Express API - Application interfaces.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

interface IApi {
    db: any;
    ip: string;
    method: string;
    body: string | null;
    request: any;
    code: number;
    cookie: any;
    handler: IErrorHandler;
    dataSource: IDataSource;
}

interface IErrorHandler {
    dataSource: IDataSource;
    errorState:boolean;
    traceStack:string[];
    log(text):void;
    info(text):void;
    warn(text):void;
    debug(text):void;
    error(text):void;
    throw(text):void;
    submit():Promise<boolean>;
}

interface IDataSource {
    url: string;
    data: any;
    request: string;
    errorState: number;
    requeries: number;
    timeout: number;
    domain: string;
    handler: IErrorHandler;
    setHandler(handler: IErrorHandler): void;
    submitTraceStack(text:string): Promise<boolean>;
}

interface IDatabase {
    pool:any;
    connection:any;
    query(request:string):Promise<any>;
}

interface IAESData {
    password: string,
    hash: string;
}

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
    IAESData,
    ILogModel,
    IRandom,
    ILogView,
    IApi,
    IDataSource,
    IErrorHandler,
    IDatabase
};