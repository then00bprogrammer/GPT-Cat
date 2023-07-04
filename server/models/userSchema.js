const Folder = require('./folderSchema');
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    query: String,
    response: String
  });

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
    bookmarks: {
        type: [[ConversationSchema]],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
