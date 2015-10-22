var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    lastSeen: {
        type: Number,
        required: true
    },
    session: {
        type: []
    }
});

module.exports = mongoose.model('Session', SessionSchema);
