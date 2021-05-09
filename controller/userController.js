const jwt = require('jsonwebtoken');
const queryCtrl = require('../services/databaseQueries');
const users = require('../models/userModel');
const api_key_logs = require('../models/apiKeyLogModel')
const api_key = require('../models/apiKeyModel')

const userController = {}

userController.signIn = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let query = {
            username: reqBody.username
        };

        let user = await queryCtrl.findOne(users, query)

        if (!user) {
            return res.status(200).type('application/json').send({
                "statusCode": 401,
                statusMsg: "Failed",
                msg: 'Unauthorized access!'
            });
        }

        let passMatch = await user.comparePassword(reqBody.password); //compare password

        if (!passMatch) { //if password does not match
            return res.status(200).type('application/json').send({
                "statusCode": 401,
                statusMsg: "Failed",
                msg: 'Unauthorized access!'
            });
        }

        let key = jwt.sign({
            username: reqBody.username,
            emailId: user.emailId
        }, 'JoK3r' + new Date().getTime());

        queryCtrl.createOne(api_key_logs, {
            'username': req.body.username,
            apiKey: key,
            created_time: new Date()
        })
        let del = await queryCtrl.deleteQuery(api_key, {
            username: reqBody.username
        })
        let newApiKey = await queryCtrl.createOne(api_key, {
            username: reqBody.username,
            apiKey: key,
            created_time: new Date()
        })
        if (newApiKey) {
            return res.status(200).type('application/json').send({
                statusCode: 200,
                statusMsg: "Success",
                "role": user.role,
                user: reqBody.username,
                "ApiKeyExpirationTime": "After every 86400 seconds (24 hours)",
                apiKey: key //send apiKey and data to server

            });
        } else {
            return res.status(200).type('application/json').send({
                "statusCode": 404,
                "statusMsg": "No data found!!"
            });
        }

    } catch (error) {
        console.log('file: userController.js > line 13 > userController.signIn= > error', error);
        return res.status(200).type('application/json').send({
            "statusCode": 425,
            "statusMsg": 'someting went wrong'
        });
    }
}

userController.createUser = async (req, res) => {
    let reqBody = JSON.parse(JSON.stringify(req.body));
    // console.log('[debug] > file: userController.js > line 80 > userController.createUser= > reqBody', reqBody)
    try {
        if (!reqBody.username && !reqBody.name) {
            return res.status(200).type('application/json').send({
                statusCode: 404,
                statusMsg: "Failed",
                msg: 'please provide username & name'
            });
        }

        if (!reqBody.password) {
            return res.status(200).type('application/json').send({
                statusCode: 404,
                statusMsg: "Failed",
                msg: 'please provide password'
            });
        }

        if (!reqBody.client) {
            return res.status(200).type('application/json').send({
                statusCode: 404,
                statusMsg: "Failed",
                msg: 'please provide client input'
            });
        }

        let existUser = await queryCtrl.findOne(users, { username: reqBody.username });
        if (existUser) {
            return res.status(200).type('application/json').send({
                statusCode: 404,
                statusMsg: "Failed",
                msg: 'username already exist'
            });
        }

        //create user query 
        let obj = {
            ...reqBody,
            createdAt: new Date(),
            username: reqBody.username,
            name: reqBody.name,
            password: reqBody.password,
            status: true,
            role: reqBody.role || "user",
            client: reqBody.client
        }
        queryCtrl.createOne(users, obj)
            .then(docs => {
                return res.status(200).type('application/json').send({
                    statusCode: 200,
                    statusMsg: "user created Successfully",
                });

            })
            .catch(error => {
                console.log("Error: ", error);
                return res.status(200).type('application/json').send({
                    statusCode: 400,
                    statusMsg: "Failed",
                    msg: 'some error occured'
                });

            });
    } catch (error) {
        console.log("Catch Error: ", error);
        return res.status(200).type('application/json').send({
            statusCode: 400,
            statusMsg: "Failed",
            msg: 'some error occured'

        });

    }

}

module.exports = userController;
