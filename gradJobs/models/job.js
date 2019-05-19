const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA IS LAYOUT OF MODEL OBJECT
const jobSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Title field is required']
      },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description field is required']
      },
    isAvailable: {
        type: Boolean,
        default: true
      }
});

module.exports = mongoose.model('jobs', jobSchema);