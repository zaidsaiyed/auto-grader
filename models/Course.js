const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  course_id: {
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
  },
});

mongoose.model("course", courseSchema);
