const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuid } = require('uuid')

const admineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    role: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

admineSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuid()
    this.hashed_password = this.cryptPassword(password)
})
.get(function() {
    return this._password
})

admineSchema.methods = {
    authenticate: function(plainText) {
        return this.cryptPassword(plainText) === this.hashed_password;
    },
    cryptPassword: function(password) {
        if(!password) return "";

        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        }catch(error) {
            return ""
        }
    }
}

module.exports = mongoose.model('Admine', admineSchema)