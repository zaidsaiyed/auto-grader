const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeschema = new Schema ({
    student_id: {
        type: Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
        maxlength: 9
      },
    course_id: {
        type: Schema.Types.ObjectId, 
        ref: 'course',
        required: true,
      },
    assign_id: {
        type: Schema.Types.ObjectId, 
        ref: 'assignment',
        required: true,
      },
      total_tests: {
        type: Schema.Types.ObjectId, ref: 'assignment',
        required: true,
      },
    earned: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            return value <= this.total; // Validate that "earned" is less than or equal to "total"
          },
          message: 'Earned points cannot exceed total points',
        },
      },
    who_checked: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        validate: {
          validator: async function (value) {
            const user = await mongoose.model('user').findById(value);
            return user && (user.type === 'P' || user.type === 'TA');
          },
          message: 'Invalid user or user type',
        },
      },
});

mongoose.model('grade', gradeschema);