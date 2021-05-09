let mongoose = require("mongoose")


let apiKeySchema = mongoose.Schema({
    apiKey:  {
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
);


const apiKey = mongoose.model("apiKeyLogs", apiKeySchema,"apiKeyLogs");
module.exports = apiKey
