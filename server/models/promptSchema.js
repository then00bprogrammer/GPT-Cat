const mongoose = require("mongoose");
const File = require('./fileSchema');

const promptSchema = new mongoose.Schema({
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
        unique: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
