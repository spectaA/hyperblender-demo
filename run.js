const fs = require('fs');
const console = require('console');

// Custom console
const output = fs.createWriteStream(`./logs/${getFormattedDateTime()}_out.log`);
const errorOutput = fs.createWriteStream(`./logs/${getFormattedDateTime()}_err.log`);
const logger = new console.Console({ stdout: output, stderr: errorOutput });
global.console = logger;

// Run app.js
try {
    require("./app.js");
} catch(err) {
    logger.error(err);
}

// Before exit
process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) logger.error('clean');
    if (exitCode || exitCode === 0) logger.error('Exit code:', exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// Formatted date-time for log file
function getFormattedDateTime() {
    const now = new Date(),
        y = now.getFullYear(),
        mo = now.getMonth() + 1,
        d = now.getDate(),
        h = now.getHours(),
        mn = now.getMinutes(),
        s = now.getSeconds();
    return `${y}-${mo}-${d}_${h}-${mn}-${s}`;
}