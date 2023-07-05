const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes:{
    type: Number,
    default: 0
  },
  likedBy:{
    type: [String],
    default:[]
  },
  view:{
    type: String,
    default: "private"
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
