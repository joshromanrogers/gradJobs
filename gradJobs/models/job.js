const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA IS LAYOUT OF MODEL OBJECT
const jobSchema = new Schema({

  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  title: {
    type: String,
    required: [true, 'Title field is required']
  },

  date: {
    type: String,
    required: [true, 'Description field is required']
  },
  url: {
    type: String,
    required: true
  }
});

// takes 2 arguments:
// 1. name of the model as you use it internally
module.exports = mongoose.model('Jobs', jobSchema);