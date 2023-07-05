const Folder = require('./folderSchema');
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    query: String,
    response: String
  });

const conversationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    conversation: [chatSchema]
})

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
        type: [conversationSchema],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
