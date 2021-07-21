const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController')
const misController = require('../controller/misController')

const apiService = require('../services/apiKeyVerification'); //middleware to verify apiKey

router.post('/log',apiService.verifyApiKey, taskController.logTime);
router.post('/createProduct',apiService.verifyApiKey, taskController.createProduct);
router.post('/get-user-products',apiService.verifyApiKey, taskController.getUserProducts);
router.post('/todaysLog',apiService.verifyApiKey, misController.todaysLog);
router.post('/mis',apiService.verifyApiKey, misController.mis);






module.exports = router
