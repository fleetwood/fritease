const winston = require('winston');
const morgan = require('morgan');

class Logger {
  constructor() {
    this.private = {
      morgan: morgan('dev'),
      winston: new winston.Logger({
        transports: [
          new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
          }),
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
          }),
        ],
        exitOnError: false,
      }),
    };
  }

  get morgan() {
    return this.private.morgan;
  }
  get logger() {
    return this.private.winston;
  }

  trace(msg) {
    console.log(msg); // eslint-disable-line no-console
    this.logger.log(msg);
  }
}

module.exports = Logger;
