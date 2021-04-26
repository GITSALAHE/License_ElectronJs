const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuid } = require('uuid')

const conducteurSchema = new mongoose.Schema({
    matricule: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    numero_du_permis: {
        type: String,
        required: true
    },
    nombre_du_point: {
        type: Number,
        default: 30
    },
    valid: {
        type: Boolean,
        default: true
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
        default: 1
    }
}, {timestamps: true})

conducteurSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuid()
    this.hashed_password = this.cryptPassword(password)
})
.get(function() {
    return this._password
})

conducteurSchema.methods = {
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

module.exports = mongoose.model('Conducteur', conducteurSchema)