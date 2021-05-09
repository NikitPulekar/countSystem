const queryCtrl = require('../services/databaseQueries');
const users = require('../models/userModel');
const timeLog = require('../models/logModel');
const itemLog = require('../models/itemModel');



const taskController = {}

taskController.logTime = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let obj = {
            createdAt: new Date().getTime(),
            itemName: reqBody.product,
            user: reqBody.username,
            status: reqBody.status
        }

        let logged = await queryCtrl.createOne(timeLog, obj)
        console.log('[debug] > file: taskController.js > line 19 > taskController.login= > logged', logged)
        return res.status(200).type('application/json').send({
            "statusCode": 200,
            "statusMsg": 'time logged successfully'
        });


    } catch (error) {
        console.log('[debug] > file: taskController.js > line 11 > userController.signIn= > error', error)
        return res.status(200).type('application/json').send({
            "statusCode": 425,
            "statusMsg": 'someting went wrong'
        });
    }
}

taskController.createProduct = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let obj = {
            createdAt: new Date().getTime(),
            itemName: reqBody.product,
            user: reqBody.username
        }

        let logged = await queryCtrl.createOne(itemLog, obj);

        return res.status(200).type('application/json').send({
            "statusCode": 200,
            "statusMsg": 'product logged'
        });


    } catch (error) {
        console.log('[debug] > file: taskController.js > line 11 > userController.signIn= > error', error)
        return res.status(200).type('application/json').send({
            "statusCode": 425,
            "statusMsg": 'someting went wrong'
        });
    }
}

module.exports = taskController;
