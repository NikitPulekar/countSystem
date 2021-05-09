const path = require("path");
const mongoose = require("mongoose");

let opts = {
    useNewUrlParser: true,
    keepAlive: 30000,
    bufferMaxEntries: 0,
    connectTimeoutMS: 45000,
    socketTimeoutMS: 60000,
    family: 4,
    useUnifiedTopology: true
};