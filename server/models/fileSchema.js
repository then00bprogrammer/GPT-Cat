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
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  starredBy: {
    type: [String],
    default: []
  },
  view: {
    type: String,
    default: "private"
  },
  referenceFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  category: {
    type: String,
    default: "general"
  },
  link:{
    type: String,
    default: "#"
  },
  publicAuthorName:{
    type: String,
    default: "Anonymous"
  }
});

fileSchema.pre('find', function(next) {
  this.populate('user', 'email');
  next();
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
