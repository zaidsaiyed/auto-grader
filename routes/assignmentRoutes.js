const mongoose = require("mongoose");
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
      const assignment = await Assignment.find({ assign_id: id}).exec();
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new assignment
  app.post("/api/assignment", async (req, res) => {
    const {
      assign_id,
      course_id,
      description,
      files_location,
      required_files,
      tests,
      results,
    } = req.body;

    try {
      const assignment = new Assignment({
        assign_id,
        course_id,
        description,
        files_location,
        required_files,
        tests,
        results,
      });

      await assignment.save();
      res.send(assignment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};
