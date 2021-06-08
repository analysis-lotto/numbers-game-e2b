const { insertDocuments } = require("./data");
const Instance = require("./instance");
const { getLogger } = require("./log");
const { fromExternal } = require("./proxy");
const { getWatermark, writeWatermarks } = require("./watermark");

const FIRST_DAY = '1938-01-01T00:00:00.000Z' // get timestamp of first day
const BEFORE_WATERMARK_WINDOW = Number.parseInt(process.env.BEFORE_WATERMARK_WINDOW) || 1
const MAX_OPERATION = Number.parseInt(process.env.MAX_OPERATION) || 5;

module.exports.execute = async () => {
    const _jobId = makeid(32)
    const LOGGER = getLogger(__filename, _jobId)
    if (BEFORE_WATERMARK_WINDOW >= MAX_OPERATION) {
        console.error(`'BEFORE_WATERMARK_WINDOW' can not be more than 'MAX_OPERATION'. `)
        process.exit()
    }


    const status = Instance.getInstance();
    let operationNumber = 0;
    if (!status.check()) {
        LOGGER.info('Starting process')
        status.start()
        await getWatermark(async (result) => {

            let pointer = result[0] ? removeDays(result[0].watermarkValue, BEFORE_WATERMARK_WINDOW) : FIRST_DAY
            const items = []

            while (watermarkInThePastDay(pointer) && operationNumber < MAX_OPERATION) {
                const parsedDate = parseDate(pointer)
                const externalData = (await fromExternal(parsedDate)).data
                const _ingestionTime = new Date().toISOString()
                const toInsert = {
                    ...externalData,
                    _data: new Date(pointer).toISOString(),
                    _jobId,
                    _ingestionTime,
                    _validFrom: _ingestionTime,
                    _validTo: new Date('2999-12-31T00:00:00Z').toISOString()
                }

                items.push(toInsert)

                pointer = addDays(pointer, 1)
                operationNumber = operationNumber + 1;
            }

            LOGGER.info(`Number of operation: ${operationNumber}`)

            insertDocuments(items, 'bronze',
                result_bronze => {
                    LOGGER.info(`Saved data in bronze layer, value ${result_bronze}`)

                    writeWatermarks(items, result_watermark => {
                        LOGGER.info(`Saved watermark for bronze layer, value ${result_watermark}`)
                        status.stop()
                        LOGGER.info('The job ended')


                    },
                        err_watermark => {
                     
                            LOGGER.error(`Error during saving watermark for bronze layer ${items}`)
                            LOGGER.error(err_watermark)

                            status.stop()
                            LOGGER.info('The job ended')

                        })

                },
                error_bronze => {
                    LOGGER.error(`Error during saving data in bronze layer ${items}`)
                    LOGGER.error(error_bronze)

                    status.stop()

                    LOGGER.info('The job ended')

                })



            status.stop()
        }, err => {
            LOGGER.error(err)
            status.stop()
            LOGGER.info('The job ended')
        })


    }

}


function watermarkInThePastDay(target) {

    const watermarkInDate = startOfTheDay(target)

    const now = startOfTheDay()

    return watermarkInDate <= now;

}

function startOfTheDay(target) {
    const temp = target ? new Date(target) : new Date()
    temp.setUTCHours(0)
    temp.setUTCMinutes(0)
    temp.setUTCSeconds(0)
    temp.setUTCMilliseconds(0)

    return temp.getTime()
}

function parseDate(target) {
    const d = new Date(target).getUTCDate()
    const m = new Date(target).getUTCMonth() + 1
    const y = new Date(target).getUTCFullYear()

    const month = m - 10 < 0 ? `0${m}` : m

    const day = d - 10 < 0 ? `0${d}` : d

    return `${y}${month}${day}`
}

function addDays(target, days) {
    const targetDate = new Date(target).getTime()

    return new Date(targetDate + (24 * 60 * 60 * 1000 * days)).toISOString()
}

function removeDays(target, days) {
    const targetDate = new Date(target).getTime()

    return new Date(targetDate - (24 * 60 * 60 * 1000 * days)).toISOString()
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}