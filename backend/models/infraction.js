const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const infractionSchema = new mongoose.Schema({
    infractionName: {
        type: String,
        required: true
    },
    TO: {
        type: ObjectId,
        ref: 'Conducteur'
    }
}, {timestamps: true})

module.exports = mongoose.model('Infraction', infractionSchema)
