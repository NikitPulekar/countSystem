const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController')
const misController = require('../controller/misController')

const apiService = require('../services/apiKeyVerification'); //middleware to verify apiKey

router.post('/log', taskController.logTime);
router.post('/createProduct',apiService.verifyApiKey, taskController.createProduct);
router.post('/get-user-products',apiService.verifyApiKey, taskController.getUserProducts);
router.post('/todaysLog',apiService.verifyApiKey, misController.todaysLog);
router.post('/mis',apiService.verifyApiKey, misController.mis);
router.post('/log-product', taskController.logProduct);
router.post('/log-products', taskController.logProducts);

router.post('/get-ids', taskController.getIds);









module.exports = router
