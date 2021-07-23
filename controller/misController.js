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
        obj['itemName'] = reqBody.product
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
            username: reqBody.username,
            itemName: reqBody.product
        }

        let createdInMonth = await queryCtrl.countDocuments(itemLog, qryObj)

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

misController.mis = async (req, res) => {
    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let obj = { username: reqBody.username }

        let startDate = ((reqBody.from_date) == null || (reqBody.from_date) == "") ? new Date() : (
            (utility.isValidDate(reqBody.from_date)) ? new Date(reqBody.from_date) : false);

        let endDate = ((reqBody.to_date) == null || (reqBody.to_date) == "") ? new Date() : (
            (utility.isValidDate(reqBody.to_date)) ? new Date(reqBody.to_date) : false);
        startDate.setHours(0, 0, 0, 0);

        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(24, 59, 59, 0);

        obj["createdAt"] = {
            "$gte": new Date(startDate.toISOString()),
            "$lt": new Date(endDate.toISOString()),
        }
        if (reqBody.itemName) obj['itemName'] = reqBody.itemName

        let itemsCreated = await queryCtrl.aggregateQuery(itemLog, [{
            $match: obj
        }, {
            $group: {
                "_id": {
                    "createdTime": { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    itemName: "$itemName"
                },
                count: { $sum: 1 },

            }
        }, {
            $project: {
                _id: 0,
                itemName: "$_id.itemName",
                createdTime: "$_id.createdTime",
                count: 1
            }
        }, {
            $group: {
                _id: "$createdTime",
                dataCounts: { '$push': '$$ROOT' },
                count: { $sum: "$count" },
            }
        }, {
            "$project": {
                _id: 0,
                createdTime: "$_id",
                dataCounts: 1,
                count: 1
            }
        },
        {
            $sort: {
                createdTime: -1
            }
        }
        ])

        return res.status(200).type('application/json').send({
            "statusCode": 200,
            // "statusMsg": `total time spent is ${hours}hr ${minutes.toFixed(0)}min maskCreated:${itemsCreated}`,
            data: itemsCreated
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
