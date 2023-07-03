const Folder = require('./folderSchema');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    bookmarks:{
        type: [String],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
