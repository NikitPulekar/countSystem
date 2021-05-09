const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/userController')
const apiService = require('../services/apiKeyVerification'); //middleware to verify apiKey

router.post('/signIn', userCtrl.signIn);
router.post('/createUser', userCtrl.createUser);


module.exports = router
