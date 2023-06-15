const mongoose = require("mongoose");
const Grade = mongoose.model("grade");
const User = mongoose.model("user");

module.exports = (app) => {
  // Get all grades
  app.get("/api/grade", async (req, res) => {
    try {
      const grades = await Grade.find({}).exec();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific grade by ID
  app.get("/api/grade/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const grade = await Grade.findById(id).exec();
      if (grade) {
        res.json(grade);
      } else {
        res.status(404).json({ message: "Grade not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new grade
  app.post("/api/grade", async (req, res) => {
    const {
      student_id,
      course_id,
      assign_id,
      total,
      earned,
      who_checked,
    } = req.body;

    try {
      const user = await User.findById(who_checked).exec();

      if (!user || (user.type !== 'P' && user.type !== 'TA')) {
        return res.status(400).json({ message: "Invalid user or user type" });
      }

      const grade = new Grade({
        student_id,
        course_id,
        assign_id,
        total,
        earned,
        who_checked,
      });

      await grade.save();
      res.send(grade);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};
