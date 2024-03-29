const mongoose = require("mongoose");
const { Schema } = mongoose;

const gradeSchema = new Schema({
  name: {
    type: String,
  },
  student_id: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    validate: {
      validator: async function (value) {
        const user = await mongoose
          .model("course")
          .findOne({ course_id: value });
        return user !== null;
      },
      message: "Course does not exist.",
    },
  },
  assign_id: {
    type: String,
    validate: {
      validator: async function (value) {
        const user = await mongoose
          .model("assignment")
          .findOne({ assign_id: value });
        return user !== null;
      },
      message: "Assignment does not exist.",
    },
  },
  total_tests: {
    type: Number,
  },
  earned: {
    type: Number,
  },
  comments: {
    type: String,
  },
});

const Grade = mongoose.model("grade", gradeSchema);
gradeSchema.index(
  { student_id: 1, course_id: 1, assign_id: 1 },
  { unique: true }
);
module.exports = Grade;
