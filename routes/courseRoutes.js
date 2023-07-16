const mongoose = require("mongoose");
const fs = require("fs");
const Course = mongoose.model("course");
const Assignment = mongoose.model("assignment");
const Grade = mongoose.model("grade");


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
      
      try {
        const course = new Course(req.body).save();
        res.send(course);

        const courseName = req.body.course_name;
        fs.mkdirSync(`./courses/${courseName}`);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

    app.delete("/api/course/del/:course_id", async (req, res) => {
      try {
        const courseId = req.params.course_id;
  
        // Delete the course
        const course = await Course.findOneAndDelete({ course_id: courseId }).exec();
  
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
  
        // Delete the assignments related to the course
        await Assignment.deleteMany({ course_id: courseId }).exec();
  
        // Delete the grades related to the course
        await Grade.deleteMany({ course_id: courseId }).exec();

        // Remove the course folder
        const courseName = course.course_name;
        fs.rmdirSync(`./courses/${courseName}`, { recursive: true });
  
  
        res.json({ message: "Course, assignments, and grades deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  };  