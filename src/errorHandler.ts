/**
 * TypeScript Application - Error handler
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */
 
import { IDataSource, IErrorHandler } from "./interfaces";

class ErrorHandler implements IErrorHandler {
    dataSource:IDataSource;
    errorState:boolean;
    traceStack:string[];
        
    constructor(dataSource:IDataSource) {
        this.dataSource = dataSource;
        this.errorState = false;
        this.traceStack = [];
    }
    
    public log(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} log ${text}`);
        console.log(text);
    }
    
    public info(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} info ${text}`);
        console.info(text);
    }
    
    public warn(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} warn ${text}`);
        console.warn(text);
    }
    
    public debug(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} debug ${text}`);
        console.debug(text);
    }
    
    public error(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} error ${text}`);
        console.error(text);
    }
    
    public throw(text):void {
        // @ts-ignore
        text = `${process.env.PREFIX}.${typeof(text) === "string" ? text : JSON.stringify(text)}`;
        this.traceStack.push(`${new Date().toLocaleString()} throw ${text}`);
        console.error(text);
        this.submit();
    }
    
    public submit():Promise<boolean> {
        return new Promise((callback) => {
            let fout = "";
            if (this.traceStack.length <= 200) {
                this.traceStack.forEach((item) => {
                    fout += item.toString().substring(0, 1000) + "\n"; 
                });
            } else {
                for (let i = 0; i < 100; i++) {
                    fout += this.traceStack[i].toString().substring(0, 1000) + "\n";
                }
                fout += `Пропущено ${this.traceStack.length - 200} строк\n\n\n`;
                for (let i = this.traceStack.length - 100; i < this.traceStack.length - 1; i++) {
                    fout += this.traceStack[i].toString().substring(0, 1000) + "\n";
                }
            }
            this.dataSource.submitTraceStack(fout).then((res) => {
                callback(res);
            });
        });
    }
}

export default ErrorHandler;
