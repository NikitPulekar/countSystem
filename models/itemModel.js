let mongoose = require("mongoose")


let itemSchema = mongoose.Schema({
    createdAt: {
        type: Date,
    }
}, { strict: false }
);

itemSchema.index({ createdAt: 1 }, { background: true });
const apiKey = mongoose.model("items", itemSchema, "items");
module.exports = apiKey