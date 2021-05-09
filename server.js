const express = require('express');
const path = require('path')
// const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const apiRoute = require("./routes/");

const app = express();

require("dotenv").config({
    path: path.join(__dirname, ".env"),
});

app.use(cors());
app.use(express.json({
    limit: "200mb"
}));
app.use(express.raw());
app.use(express.text());

// app.use(bodyParser.json({
//     limit: "200mb"
// }));
// app.use(bodyParser.urlencoded({
//     limit: "200mb",
//     extended: true
// }));
// app.use(bodyParser.raw());
// app.use(bodyParser.text());
app.use("/api", apiRoute);

let opts = {
    useNewUrlParser: true,
    keepAlive: 30000,
    bufferMaxEntries: 0,
    connectTimeoutMS: 45000,
    socketTimeoutMS: 60000,
    family: 4,
    useUnifiedTopology: true
};

mongoose.connect(process.env.db_url, opts).then(() => {
    console.log("Connected to Database");
});


let port = process.env.port || "3000";
app.listen(port, () => {
    console.log(`connected to PORT ${process.env.port}`)
})

app.on('error', (error) => {
    console.log("<>><><><><><>", error)
})

app.use((err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: "Something failed!" });
    } else {
        next(err);
    }
});

app.use(function (err, req, res, next) {
    console.error("Error Stack", err.stack);
    return res.status(500).send("Something broken!");
});