let mongoose = require("mongoose")


let logTime = mongoose.Schema({
    createdAt: {
        type: Date,
    },
    type: String
}, { strict: false }
);

logTime.index({ createdAt: 1 }, { background: true });
const timeLog = mongoose.model("timeLogs", logTime, "timeLogs");
module.exports = timeLog