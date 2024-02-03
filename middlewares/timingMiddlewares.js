const fs = require('fs');

function loginTiming(req, res, next) {
    req.loginStartTime = Date.now();
    res.on('finish', () => {
        const loginEndTime = Date.now();
        const duration = loginEndTime - req.loginStartTime;
        const logEntry = `Χρόνος σύνδεσης: ${duration}ms\n`;
        fs.appendFile('loginTimingLog.txt', logEntry, (err) => {
            if (err) throw err;
        });
    });
    next();
}

function verificationTiming(req, res, next) {
    req.verifyStartTime = Date.now();
    res.on('finish', () => {
        const verifyEndTime = Date.now();
        const duration = verifyEndTime - req.verifyStartTime;
        const logEntry = `Χρόνος επιβεβαίωσης: ${duration}ms\n`;
        fs.appendFile('verificationTimingLog.txt', logEntry, (err) => {
            if (err) throw err;
        });
    });
    next();
}

module.exports = {verificationTiming,loginTiming};