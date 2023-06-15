const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    assign_id: {
        type: String,
        required: true,
        unique: true,
      },
      course_id: {
        type: Schema.Types.ObjectId, ref: 'course',
        required: true,
      },
      description: {
        type: String,
        maxlength: 100,
      },
      files_location: {
        type: String,
      },
      required_files: {
        type: String,
      },
      tests: {
        type: Number,
      },
      results: {
        type: Number,
      },
    });
    

mongoose.model('assignment', assignmentSchema);