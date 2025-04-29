// Logger.js
export const Logger = {
    critical: (message, ...args) => console.error(`CRITICAL: ${message}`, ...args),
    error: (message, ...args) => console.error(message, ...args),
    warn: (message, ...args) => console.warn(message, ...args),
    info: (message, ...args) => console.info(message, ...args),
    debug: (message, ...args) => {
        // console.log(`DEBUG: ${message}`, process.env.APP_DEBUG );
        // if (process.env.APP_DEBUG === true) {
            console.debug(message, ...args);
        // }
    },
    log: (message, ...args) => console.log(message, ...args),
};