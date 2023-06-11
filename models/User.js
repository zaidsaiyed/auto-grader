const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    user_name: String,
    student_id: String,
    password: String,
    types: {
        type: String,
        enum: ['A', 'B', ''],
        default: 'A',
      },
}, {
    timestamps: true
});

mongoose.model('user', userSchema);