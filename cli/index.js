const axios = require('axios')
const s = process.env.super_secret


module.exports.fromExternal = async () => {
    const basePath = process.env.ENV_BASE_PATH;
    const code = process.env.ENV_AUTH_CODE;
    const runId = process.env.GITHUB_RUN_ID
    const runNumber = process.env.GITHUB_RUN_NUMBER
    
    const url = basePath + '?code=' + code + '&runId=' + runId + '-' + runNumber;

    console.log('Url used')
    console.log(url)    
    
    const result = await axios.get(url)
    console.log('Result From Job')
    console.log(result.data)
}



this.fromExternal()