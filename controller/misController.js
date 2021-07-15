const queryCtrl = require('../services/databaseQueries');
const users = require('../models/userModel');
const timeLog = require('../models/logModel');
const itemLog = require('../models/itemModel');

const misController = {}

misController.todaysLog = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));

        let obj = {
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 59))
            },
            username: reqBody.username
        }
        let logged = await queryCtrl.findByQuery(timeLog, obj);
        logged = JSON.parse(JSON.stringify(logged))
        let maskCreated = await queryCtrl.countDocuments(itemLog, obj)

        let time = {}

        for (const item of logged) {
            if ((item.status === 'login' && new Date(item.createdAt) < new Date(time.login))) {
                time[item.status] = new Date(item.createdAt)
            } else if (item.status === 'login' && !time['login']) time[item.status] = new Date(item.createdAt)

            if ((item.status === 'logout' && new Date(item.createdAt) > new Date(time.logout))) {
                time[item.status] = new Date(item.createdAt)
            } else if (item.status === 'logout' && !time['logout']) time[item.status] = new Date(item.createdAt)
        }

        let date = new Date(), y = date.getFullYear(), m = date.getMonth()
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 1);

        let qryObj = {
            createdAt: {
                $gte: firstDay,
                $lte: lastDay
            },
            username: reqBody.username
        }

        let createdInMonth = await queryCtrl.countDocuments(itemLog, qryObj)
        console.log('[debug] > file: misController.js > line 46 > misController.todaysLog= > createdInMonth', createdInMonth)



        let seconds = (new Date(time.logout).getTime() - new Date(time.login).getTime()) / 1000;

        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor(seconds % 3600 / 60);

        return res.status(200).type('application/json').send({
            "statusCode": 200,
            "statusMsg": `success`,
            data: {
                loginTime: time.login,
                hour: hours,
                minutes: minutes,
                maskCreated: maskCreated,
                createdInMonth
            }
        });


    } catch (error) {
        console.log('[debug] > file: misController.js > line 11 > userController.signIn= > error', error)
        return res.status(200).type('application/json').send({
            "statusCode": 425,
            "statusMsg": 'someting went wrong'
        });
    }
}

misController.maskWithinTime = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let obj = {
        }

        if (reqBody.fromDate) {
            obj['createdAt']['$gte'] = new Date(new Date(reqBody.fromDate))
        }

        if (reqBody.toDate) {
            obj['createdAt']['$lte'] = new Date(new Date(reqBody.toDate))
        }

        let maskCreated = await queryCtrl.countDocuments(itemLog, obj)

        return res.status(200).type('application/json').send({
            "statusCode": 200,
            "statusMsg": `total time spent is ${hours}hr ${minutes.toFixed(0)}min maskCreated:${maskCreated}`,
            data: {
                maskCreated: maskCreated
            }
        });


    } catch (error) {
        console.log('[debug] > file: misController.js > line 11 > userController.signIn= > error', error)
        return res.status(200).type('application/json').send({
            "statusCode": 425,
            "statusMsg": 'someting went wrong'
        });
    }
}

module.exports = misController;
