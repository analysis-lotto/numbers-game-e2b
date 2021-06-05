const data = require('./data')

const COLLECTION_NAME = 'watermark'
const TABLE_NAME = 'bronze'

module.exports.getWatermark = (cb, err) => {
    data.getWatermark({ tableName: TABLE_NAME }, COLLECTION_NAME, cb, err)
}

module.exports.writeWatermark = (pointer, cb, err) => {
    data.insertDocument({
        tableName: TABLE_NAME,
        watermarkValue: pointer
    }, COLLECTION_NAME,
        cb, err
    )
}