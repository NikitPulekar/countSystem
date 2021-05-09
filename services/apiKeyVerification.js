const queryCtrl = require('./databaseQueries');
const api_key = require('../models/apiKeyModel');
const users = require('../models/userModel')

async function verifyApiKey(req, res, next) {
    req['body'] = JSON.parse(JSON.stringify(req.body))
    // if (req.body.username == "mysteriousVerifyApi" && req.body.apiKey == "eyQXzRyS0DiHdUluz6tUsFwB2unABE-HwF3CigMPPjjQa") {
    //     apiLog(req, res, req.body.username);
    //     next();
    // } else {
    let loginAppKey = null;

    if (!req.headers.username || req.headers.username == null) {
        let unauthorized_log = {
            statusCode: 401,
            statusMsg: "Failed",
            msg: 'Username is missing!'
        }
        // apiLog(req, res, req.headers.username, unauthorized_log)
        return res.status(200).send(unauthorized_log);
    }

    if (req.headers.authorization) {
        authToken = req.headers.authorization
        token = authToken.split(' ');

        loginAppKey = await queryCtrl.findOne(api_key, { 'apiKey': token[1] })
        if (loginAppKey == null) {
            let unauthorized_log = {
                statusCode: 401,
                statusMsg: "Failed",
                msg: 'Unauthorized access!'
            }
            // apiLog(req, res, req.headers.username, unauthorized_log)
            return res.status(200).send(unauthorized_log);
        }

        if (req.headers.username != loginAppKey.username) {
            let unauthorized_log = {
                statusCode: 401,
                statusMsg: "Failed",
                msg: 'Username is invalid!'
            }
            // apiLog(req, res, req.headers.username, unauthorized_log)
            return res.status(200).send(unauthorized_log);
        }

        if (req.path != '/signIn') {

            // apiLog(req, res, loginAppKey.username);
            next()
        }
    } else {
        let unauthorized_log = {
            statusCode: 401,
            statusMsg: "Failed",
            msg: 'Unauthorized access!'
        }
        // apiLog(req, res, req.body.username, unauthorized_log)
        return res.status(200).send(unauthorized_log);
    }
    // }
}

// async function apiLog(req, res, api_key_username, unauthorized_log) {
//     let query = {
//         ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
//         username: api_key_username,
//         apiName: req.path,
//         headers: req.headers,
//         reqBody: req.body,
//         response: unauthorized_log,
//         created_time: new Date()
//     }

//     let data = await queryCtrl.createOne(logApi, query)
//     if (data) { console.log("Api logged successfully!!"); }
// }

module.exports = {
    verifyApiKey
}