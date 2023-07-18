const mongoose = require("mongoose");
const fs = require("fs");
const fset = require("fs-extra");
const multer = require("multer");
const Course = mongoose.model("course");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const courseId = req.params.course_id;
    const courseFolderPath = `./courses/${courseId}`;
    if (!fs.existsSync(courseFolderPath)) {
      fs.mkdirSync(courseFolderPath);
    }
    cb(null, courseFolderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${req.params.course_id}.csv`;
    cb(null, fileName);
  },
});

// Create multer upload instance
const upload = multer({ storage });

module.exports = (app) => {
  // Get all courses
  app.get("/api/course", async (req, res) => {
    try {
      const courses = await Course.find({}).exec();
      res.json(courses);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
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
        res.status(404).json({
          message: "Course not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  // Create a new course
  app.post("/api/course", async (req, res) => {
    try {
      const course = new Course(req.body).save();
      res.send(course);

      const courseId = req.body.course_id;
      fs.mkdirSync(`./courses/${courseId}`);
      const courseFolderPath = `./courses/${courseId}`;
      const emptyFilePath = `${courseFolderPath}/empty-file.txt`;
      fs.writeFileSync(emptyFilePath, "");
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  });

  // Delete a course
  app.delete("/api/course/del/:course_id", async (req, res) => {
    try {
      const courseId = req.params.course_id;

      // Delete the course
      const course = await Course.findOneAndDelete({
        course_id: courseId,
      }).exec();

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Delete the course folder
      const courseFolderPath = `./courses/${courseId}`;
      await fset.remove(courseFolderPath);
      res.json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });

  // Check if a file exists for a course
  app.get("/api/course/file-exists/:course_id", (req, res) => {
    const { course_id } = req.params;

    const courseFolderPath = `./courses/${course_id}`;
    const filePath = `${courseFolderPath}/${course_id}.csv`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.json({ fileExists: false });
      } else {
        res.json({ fileExists: true });
      }
    });
  });

  // Upload a CSV file for a course
  app.post("/api/course/upload/:course_id", upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    } else {
      res.json({ success: true });
    }
  });
};
