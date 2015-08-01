var mongoose = require('mongoose');

var PermSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    group: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Permission', PermSchema);