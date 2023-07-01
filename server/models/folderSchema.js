const { mongoose } = require("mongoose");

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
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
  }],
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
