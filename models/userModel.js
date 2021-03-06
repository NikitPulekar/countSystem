let mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const saltRounds = 10

let userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String,
        trim: true
    },
    address: {
        type: Object
    },
    birthDate: {
        type: Date,
    },
    mobileNumber: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    emailId: {
        type: String
    },
    client: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    createdBy: {
        type: String
    },
    apiHitLimit: {
        type: Number,
        default: 0
    },
    updateDetails: [{
        date: {
            type: Date,
        },
        time: {
            type: String,
        },
        userId: {
            type: String,
        },
    }],
    imageUrl: {
        type: String,
    },
    role: {
        type: String,
    },
    deviceDetails: {
        type: Object,
    },
    deviceToken: {
        type: String,
    },
    userToken: {
        type: String,
    },
    limit: {
        type: Number,
        default: 25
    }
}, { strict: false })

userSchema.pre('save', function (next) {
    var user = this
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})
userSchema.pre('update', function (next) {
    var user = this
    if (user._update['$set'].password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {

            if (err) return next(err)
            bcrypt.hash(user._update['$set'].password, salt, function (err, hash) {
                if (err) return next(err)
                user._update['$set'].password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.pre('findOneAndUpdate', function (next) {
    var user = this;
    if (user._update['$set'].password) {
        console.log("..........." + user._update['$set'].password);
        bcrypt.genSalt(saltRounds, function (err, salt) {

            if (err) return next(err)
            bcrypt.hash(user._update['$set'].password, salt, function (err, hash) {
                if (err) return next(err)
                user._update['$set'].password = hash
                next()
            })
        })
    } else {
        next()
    }

})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model('users', userSchema, 'users')
module.exports = userModel
