const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseschema = new Schema ({
    course_ID: {
        type: String,
        required: true,
        unique: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    prof: {
        type: String,
        required: true,
    }
})

mongoose.model('course', courseschema);