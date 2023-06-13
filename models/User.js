const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    student_id:{
        type: String,
        required: true,
        maxlength: 9
    },
    password: {
        type: String,
        required: true,
    },
    types: {
        type: String,
        enum: ['A','S','P','TA'],
        default: 'S',
      },
}, {
    timestamps: true
});

mongoose.model('user', userSchema);