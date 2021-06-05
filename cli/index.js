const axios = require('axios')
const s = process.env.super_secret
console.log(s)

module.exports.fromExternal = async () => {
    const basePath = process.env.BASE_PATH;
    const code = process.env.CODE;
    const runId = process.env.GITHUB_RUN_ID
    const runNumber = process.env.GITHUB_RUN_NUMBER




    return await axios.get(process.env.URL)
}


