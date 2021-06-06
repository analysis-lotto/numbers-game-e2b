# numbers-game-e2b

This nodeJS application start a job to keep data from external system and push on bronze layer.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the installed.

```sh
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Environment Variables
| Name                    | Description                                                                          | Default                                              |
|-------------------------|--------------------------------------------------------------------------------------|------------------------------------------------------|
| MONGO_CONNECTION_STRING |                                                                                      | mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb |
| MONGO_DB_NAME           |                                                                                      | NumbersGame                                          |
| AUTH_CODE               | The authorization code to execute rest api. If not present application does no start | **NA**                                               |
| PORT                    |                                                                                      | 5000                                                 |
| BEFORE_WATERMARK_WINDOW | Min window interval for pulling                                                      | 1                                                    |
| MAX_OPERATION           | Max pull to execute in job execution                                                 | 1000                                                 |

:warning: **If you are running on Heroku**: Not set PORT environment variables!


Other documentation [here](https://github.com/analysis-lotto/numbers-game-e2b/tree/main/doc)