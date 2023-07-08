const mongoose = require("mongoose");

const writingStyleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

const WritingStyle = mongoose.model('WritingStyle', writingStyleSchema);

module.exports = WritingStyle;
