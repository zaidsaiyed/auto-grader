const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new Schema({
  student_id: {
    type: String,
    required: true
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
  assign_id: {
    type: String,
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('assignment').findOne({ assign_id: value });
        return user !== null;
      },
      message: 'Assignment does not exist.'
    },
    required: true
  },
  total_tests: {
    type: Number,
    required: true
  },
  earned: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value <= this.total_tests;
      },
      message: 'Earned marks cannot exceed total tests marks'
    }
  },
  who_checked: {
    type: String,
    required: true,
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('user').findOne({ user_name: value, types: { $in: ['P', 'TA'] } });
        return user !== null;
      },
      message: 'Who checked must be either a Professor (P) or a Teaching Assistant (TA)'
    }
  }
});


const Grade = mongoose.model('grade', gradeSchema);
gradeSchema.index({ student_id: 1, course_id: 1, assign_id: 1 }, { unique: true });
module.exports = Grade;
