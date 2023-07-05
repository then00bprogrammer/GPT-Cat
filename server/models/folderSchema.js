const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
  },
  folders: [{
    name: {
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
  }],
  files: [{
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    view:{
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
    referenceFile:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
