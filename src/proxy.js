const axios = require('axios')

module.exports.fromExternal = async (data) => {
    return await axios.post('https://www.lotto-italia.it/gdl/estrazioni-e-vincite/estrazioni-del-lotto.json', { data })
}
