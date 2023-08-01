const mongoose = require("mongoose");
const fs = require("fs");
const fset = require("fs-extra");
const multer = require("multer");
const Course = mongoose.model("course");
const csvParser = require("csv-parser");
const Assignment = mongoose.model("assignment");

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
  app.post(
    "/api/course/upload/:course_id",
    upload.single("file"),
    async (req, res) => {
      const courseId = req.params.course_id;
      const filePath = `./courses/${courseId}/${courseId}.csv`;

      const dataToInsert = []; // Declare the dataToInsert array here
      let headers = []; // Declare the headers array here
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("headers", async (headers) => {
          // Trim headers to remove leading and trailing spaces
          headers = headers.map((header) => header.trim());
          // Find the column names containing " Points" and extract assignIds from them
          const assignIds = headers
            .filter((col) => col.includes(" Points"))
            .map((col) => col.replace(/ Points.*$/, ""));
          console.log(assignIds);

          // If no assignIds found, return an error response
          if (assignIds.length !== 0) {
            assignIds.forEach((assignId) => {
              dataToInsert.push({
                assign_id: assignId,
                course_id: courseId,
                description: "",
                files_location: "",
                required_files: "",
                total_tests: null,
              });
            });
            console.log(dataToInsert);

            // Assuming you have already connected to your MongoDB database
            try {
              // Insert the data into the Assignment collection
              await Assignment.insertMany(dataToInsert);

              // Respond with a success message
              return res
                .status(200)
                .json({ success: true, message: "Data inserted successfully" });
            } catch (error) {
              console.error("Error inserting data into the database:", error);
              return res
                .status(500)
                .json({ success: false, message: "Error inserting data" });
            }
          } else {
            return res.status(400).json({ message: "No assignment IDs found" });
          }
        });
    }
  );
};
