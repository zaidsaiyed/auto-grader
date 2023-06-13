const mongoose = require("mongoose");
const Course = mongoose.model("course");

module.exports = (app) => {
    // Get all courses
  app.get("/api/course", async (req, res) => {
    try {
      const courses = await Course.find({}).exec();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/course", async (req, res) => {
    const{
        course_id,
        course_name,
        prof
    } = req.body;

    const course = new Course({
      course_id,
      course_name,
      prof
    }).save();

    res.send(course);
  });
};
