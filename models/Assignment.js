const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    assign_id: {
        type: String,
        required: true,
        unique: true,
      },
      course_id: {
        type: String,
        validate: {
          validator: async function(value) {
            const user = await mongoose.model('course').findOne({ course_id: value });
            return user !== null;
          },
          message: 'Course does not exist.'
        },
        required: true
      },
      description: {
        type: String,
      },
      files_location: {
        type: String,
      },
      required_files: {
        type: String,
      },
      total_tests: {
        type: Number,
      },
      results: {
        type: Number,
      },
    });
    
assignmentSchema.index({ course_id: 1, assign_id: 1 }, { unique: true });
mongoose.model('assignment', assignmentSchema);