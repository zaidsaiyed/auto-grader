const mongoose = require('mongoose');
const { Schema } = mongoose;

const assignmentSchema = new Schema({
    assign_ID: {
        type: Number,
        required: true,
        unique: true,
      },
      course_ID: {
        type: Number,
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
        maxlength: 10,
      },
      tests: {
        type: Number,
      },
      results: {
        type: Number,
      },
    });
    