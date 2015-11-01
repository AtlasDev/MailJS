var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    lastSeen: {
        type: Number,
        required: true
    },
    reads: {
        type: Number,
        default: 0
    },
    ip: {
        type: String,
        required: true
    },
    session: {
        type: mongoose.Schema.Types.Mixed
    }
});

module.exports = mongoose.model('Session', SessionSchema);
