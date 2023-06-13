const mongoose = require("mongoose");
const Course = mongoose.model("course");

module.exports = (app) => {
  // Get course by ID
  app.get("/api/course/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const course = await Course.findOne({ course_id: id }).exec();
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new course
  app.post("/api/course", async (req, res) => {
    const { course_id, course_name, prof } = req.body;

    try {
      const course = new Course({
        course_id,
        course_name,
        prof,
      });

      await course.save();
      res.send(course);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};
