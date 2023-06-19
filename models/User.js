const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    student_id: {
        type: Number,
        required: true,
        validate: {
          validator: function (value) {
            // Allow multiple documents with student_id = 0
            if (value === 0) {
              return true;
            }
    
            // Check for uniqueness of student_id
            return mongoose.models.user.countDocuments({ student_id: value })
              .then((count) => count === 0);
          },
          message: 'Student ID must be unique except when it is 0.',
        },
        maxlength: 9,
    },
    password: {
        type: String,
        required: true,
    },
    types: {
        type: String,
        enum: ['A','S','P','TA'],
        default: 'S',
        required: true,
      },
}, {
    timestamps: true
});

mongoose.model('user', userSchema);