var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  //id: { type: Number, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  subcategory: { type: Array },
  img: String,
  author: Number,
  updatedTime: Date
});

var NoteModel = mongoose.model('NoteModel', noteSchema);

// make this available to our users in our Node applications
module.exports = NoteModel;