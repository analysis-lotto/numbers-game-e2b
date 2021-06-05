const { insertDocument } = require("./data");
const Instance = require("./instance");
const { fromExternal } = require("./proxy");
const { getWatermark, writeWatermark } = require("./watermark");

const FIRST_DAY = new Date('1939-01-01T00:00:00.000Z').getTime() // get timestamp of first day

const MAX_OPERATION = 1000;

module.exports.execute = async (_jobId) => {
    const status = Instance.getInstance();
    let operationNumber = 0;
    if (!status.check()) {
        status.start()

        await getWatermark( async (result) => {

            let pointer = result[0] ? result[0].watermarkValue + (24 * 60 * 60 * 1000) : FIRST_DAY


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
                
                insertDocument(toInsert, 'bronze',
                    result_bronze => {
                        console.log(`Saved data in bronze layer, value ${result_bronze}`);

                        writeWatermark(pointer, result_watermark => {
                            console.log(`Saved watermark for bronze layer, value ${result_watermark}`);
                
                        },
                        err_watermark => {
                            console.log(`Error during saving watermark for bronze layer ${pointer}`);
                            console.log(err_watermark)
                        })

                    },
                    error_bronze => {
                        console.log(`Error during saving data in bronze layer ${pointer}`);
                        console.log(error_bronze)


                    })

                pointer = pointer + (24 * 60 * 60 * 1000)
                operationNumber = operationNumber + 1;
            }

            console.log(`Number of operation: ${operationNumber}`)

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

    return watermarkInDate < now;

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

    const month = m -10<0 ? `0${m}` : m

    const day = d -10 <0? `0${d}` : d

    return `${y}${month}${day}`
}