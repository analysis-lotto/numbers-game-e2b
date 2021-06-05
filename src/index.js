const express = require('express')
const app = express()
const port = 3000

const Instance = require('./instance')
const { execute } = require('./job')

const AUTH_CODE = process.env.AUTH_CODE || 'ABCD'
const PORT = process.env.PORT || 5000



app.get('/start', (req, res) => {
    const authCodeRequest = req.query.code 

    const runId = req.query.runId 

    if(!authCodeRequest) {
        res.status(403)
        .json({
            error: `Missing 'code' query param.`
        })
    } else if(authCodeRequest !== AUTH_CODE) {
        res.status(401)
        .json({
            error: `'code' value is not correct. Unauthorized!`
        })

    } else if(!runId) {
        res.status(400)
        .json({
            error: `Missing 'runId' query param.`
        })

    } else {
        execute()
        res.status(204)
        .json({
            runId
        })
    }


})

app.get('/check', (req, res) => {
    const authCodeRequest = req.query.code 

    if(!authCodeRequest) {
        res.status(403)
        .json({
            error: `Missing 'code' query param.`
        })
    } else if(authCodeRequest !== AUTH_CODE) {
        res.status(401)
        .json({
            error: `'code' value is not correct. Unauthorized!`
        })

    } else {
        const status = Instance.getInstance();   
        res.status(200).json({
            running: status.check()
        })
    }
})

app.get('/stop', (req, res) => {
    const authCodeRequest = req.query.code 

    if(!authCodeRequest) {
        res.status(403)
        .json({
            error: `Missing 'code' query param.`
        })
    } else if(authCodeRequest !== AUTH_CODE) {
        res.status(401)
        .json({
            error: `'code' value is not correct. Unauthorized!`
        })

    } else {
        const status = Instance.getInstance();
    
        status.stop()
    
        res.end()
        res.status(204)
        .end()
    }

})


if(!AUTH_CODE) {
    console.error(`environment variable 'AUTH_CODE' not provided. Application will not start.`)
    process.exit()
}
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)

})
