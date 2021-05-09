const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController')
const misController = require('../controller/misController')

const apiService = require('../services/apiKeyVerification'); //middleware to verify apiKey

router.post('/log',apiService.verifyApiKey, taskController.logTime);
router.post('/createProduct',apiService.verifyApiKey, taskController.createProduct);
router.post('/todaysLog',apiService.verifyApiKey, misController.todaysLog);





module.exports = router
