const { insertDocuments } = require("./data");
const Instance = require("./instance");
const { fromExternal } = require("./proxy");
const { getWatermark, writeWatermarks } = require("./watermark");

const FIRST_DAY = new Date('1938-01-01T00:00:00.000Z').getTime() // get timestamp of first day
const BEFORE_WATERMARK_WINDOW = process.env.BEFORE_WATERMARK_WINDOW || 1
const MAX_OPERATION = process.env.MAX_OPERATION || 5;

module.exports.execute = async (_jobId) => {

    if (BEFORE_WATERMARK_WINDOW >= MAX_OPERATION) {
        console.error(`'BEFORE_WATERMARK_WINDOW' can not be more than 'MAX_OPERATION'. `)
    }


    const status = Instance.getInstance();
    let operationNumber = 0;
    if (!status.check()) {
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

            console.log(`Number of operation: ${operationNumber}`)
            // console.log(items.length)


            insertDocuments(items, 'bronze',
                result_bronze => {
                    console.log(`Saved data in bronze layer, value ${result_bronze}`);

                    writeWatermarks(items, result_watermark => {
                        console.log(`Saved watermark for bronze layer, value ${result_watermark}`);
                        status.stop()

                    },
                        err_watermark => {
                            console.log(`Error during saving watermark for bronze layer ${items}`);
                            console.log(err_watermark)
                            status.stop()
                        })

                },
                error_bronze => {
                    console.log(`Error during saving data in bronze layer ${items}`);
                    console.log(error_bronze)
                    status.stop()
                })



            status.stop()
        }, err => {
            status.stop()

            console.log(err)
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