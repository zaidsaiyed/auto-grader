const mongoose = require("mongoose");
const fs = require("fs-extra");
const Assignment = mongoose.model("assignment");

module.exports = (app) => {
  // Get all assignments
  app.get("/api/assignment", async (req, res) => {
    try {
      const assignments = await Assignment.find({}).exec();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific assignment by ID
  app.get("/api/assignment/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const assignment = await Assignment.findById(id).exec();
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get assignments by course_id
  app.get("/api/assignments/course/:courseId", async (req, res) => {
    const { courseId } = req.params;

    try {
      const assignments = await Assignment.find({ course_id: courseId }).exec();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete an assignment
  app.delete("/api/assignment/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const assignment = await Assignment.findByIdAndDelete(id);
      if (!assignment) {
        res.status(404).json({ message: "Assignment not found" });
        return;
      }

      // Delete the assignment folder
      const folderPath = assignment.files_location;
      await fs.remove(folderPath);

      res.json({ message: "Assignment deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
