const axios = require('axios')

console.log(process.env)

module.exports.fromExternal = async () => {
    const basePath = process.env.BASE_PATH;
    const code = process.env.CODE;
    const runId = process.env.github.run_id

    return await axios.get(process.env.URL)
}


