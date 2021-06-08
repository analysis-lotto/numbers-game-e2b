const winston = require('winston');
 


module.exports.getLogger = (service, jobId) => {

    const timestamp = startOfTheDay()

    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service, jobId},
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        // new winston.transports.File({ filename: `${timestamp}-error.log`, level: 'error' }),
        // new winston.transports.File({ filename: `${timestamp}-combined.log` }),
      ],
    });


    if(process.env.FILE_LOG && process.env.FILE_LOG.toLowerCase() === 'true') {
      logger.add(new winston.transports.File({ filename: `${timestamp}-error.log`, level: 'error' }));
      logger.add(new winston.transports.File({ filename: `${timestamp}-combined.log` }));

    }

    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));

    return logger

}


function startOfTheDay(target) {
    const temp = target ? new Date(target) : new Date()
    temp.setUTCHours(0)
    temp.setUTCMinutes(0)
    temp.setUTCSeconds(0)
    temp.setUTCMilliseconds(0)

    return temp.getTime()
}
