// Logger.js
export const Logger = {
    critical: (message: string, ...args: unknown[]) => { console.error(`CRITICAL: ${message}`, ...args); },
    error: (message: string, ...args: unknown[]) => { console.error(message, ...args); },
    warn: (message: string, ...args: unknown[]) => { console.warn(message, ...args); },
    info: (message: string, ...args: unknown[]) => { console.info(message, ...args); },
    debug: (message: string, ...args: unknown[]) => {
        // console.log(`DEBUG: ${message}`, process.env.APP_DEBUG );
        // if (process.env.APP_DEBUG === true) {
        console.debug(message, ...args);
        // }
    },
    log: (message: string, ...args: unknown[]) => { console.log(message, ...args); },
};