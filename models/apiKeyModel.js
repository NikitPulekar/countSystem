let mongoose = require("mongoose")

let apiKeySchema = mongoose.Schema({
    apiKey: {
        type: String
    },
    username: {
        type: String
    },
    createdAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true });

apiKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400, background: true });
const apiKey = mongoose.model("apiKey", apiKeySchema, "apiKey");
module.exports = apiKey