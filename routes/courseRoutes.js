const mongoose = require("mongoose");
const fs = require("fs");
const { log } = require("console");
const Course = mongoose.model("course");
const Assignment = mongoose.model("assignment");
const Grade = mongoose.model("grade");
const multer = require('multer');


module.exports = (app) => {
  // Get all courses
  app.get("/api/course", async (req, res) => {
    try {
      const courses = await Course.find({}).exec();
      res.json(courses);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });

  // Get course by ID
  app.get("/api/course/:id", async (req, res) => {
    const {
      id
    } = req.params;

    try {
      const course = await Course.findOne({
        course_id: id
      }).exec();
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({
          message: "Course not found"
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
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
        message: error.message
      });
    }
  });

  // Delete a new assignment
  app.delete("/api/course/del/:course_id", async (req, res) => {
    try {
      const courseId = req.params.course_id;

      // Delete the course
      const course = await Course.findOneAndDelete({
        course_id: courseId
      }).exec();

      if (!course) {
        return res.status(404).json({
          message: "Course not found"
        });
      }

      // Delete the assignments related to the course
      await Assignment.deleteMany({
        course_id: courseId
      }).exec();

      // Delete the grades related to the course
      await Grade.deleteMany({
        course_id: courseId
      }).exec();

      // Remove the course folder
      fs.rmdirSync(`./courses/${courseId}`, {
        recursive: true
      });


      res.json({
        message: "Course, assignments, and grades deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  });

  // Upload a course csv file
  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      const courseFolderPath = `./courses/`;
      cb(null, courseFolderPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({
    storage: fileStorageEngine
  });
  
  app.post("/api/course/upload", upload.single('file'), async (req, res) => {
    try { 
      console.log(req.file);

      fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }

        const rows = data.split('\n');
        // Process each row
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          console.log(row); // Do something with the row
          const columns = row.split(',');

          // Access the values in each column
          for (let j = 0; j < columns.length; j++) {
            const value = columns[j];
            //console.log(value); // Do something with the value -->
          }
        }
      });

      res.json({
        message: "File uploaded successfully"
      });
    } 
    catch (error) {
      console.log(error);
      res.status(500).json({
        message: error.message
      });
    }
  });
};