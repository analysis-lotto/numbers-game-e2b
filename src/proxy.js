const axios = require('axios')

module.exports.fromExternal = async (data) => {
    return await axios.post('https://www.lotto-italia.it/gdl/estrazioni-e-vincite/estrazioni-del-lotto.json', { data })
}


// module.exports.getAllCSV = async () => {
//     return await axios.get('http://localhost/lotto/list/')
// }

// module.exports.csvToSQLCommand = async (anno) => {
//     return await axios.get(`http://localhost/lotto/csv-to-sql?anno=${anno}`)
// }