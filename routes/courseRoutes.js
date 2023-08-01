const mongoose = require("mongoose");
const fs = require("fs");
const fset = require("fs-extra");
const multer = require("multer");
const Course = mongoose.model("course");
const csvParser = require("csv-parser");
const Assignment = mongoose.model("assignment");
const Grade = mongoose.model("grade");

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

      //Delete related assignments
      await Assignment.deleteMany({
        course_id: courseId,
      });

      //Delete related grades
      await Grade.deleteMany({
        course_id: courseId,
      });

      res.json({
        message: "Course, assignments, and grades deleted successfully",
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

      const assignments = []; // Store assignment data here
      const students = new Set(); // Store student IDs using a Set
      const studentNames = new Map(); // Store student names using a Map

      // Parse the CSV file
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("headers", (headers) => {
          // Trim headers to remove leading and trailing spaces
          headers = headers.map((header) => header.trim());
          // Find the column names containing " Points" and extract assignIds from them
          const assignIds = headers
            .filter((col) => col.includes(" Points"))
            .map((col) => col.replace(/ Points.*$/, ""));

          // If no assignIds found, return an error response
          if (assignIds.length !== 0) {
            //Insert Assignment Data
            assignIds.forEach((assignId) => {
              assignments.push({
                assign_id: assignId,
                course_id: courseId,
                description: "",
                files_location: "",
                required_files: "",
                total_tests: null,
              });
            });
  

            //Parse the CSV file again to get student data
            fs.createReadStream(filePath)
              .pipe(csvParser())
              .on("headers", () => {
                // Skip headers for student data parsing
              })
              .on("data", (row) => {
                //Insert Student Data
                const studentId = row["OrgDefinedId"].replace("#", ""); // Remove "#" symbol
                const firstName = row["First Name"];
                const lastName = row["Last Name"];

                students.add(studentId);
                studentNames.set(studentId, { firstName, lastName });
              })
              .on("end", async () => {
                // All CSV data has been processed
                try {
                  // Insert Assignment Data
                  await Assignment.insertMany(assignments);

                  // Insert Grade Data for each student with default earned = null
                  const grades = [];
                  students.forEach((studentId) => {
                    assignIds.forEach((assignId) => {
                      const studentName = studentNames.get(studentId);
                      grades.push({
                        name: `${studentName.firstName} ${studentName.lastName}`,
                        student_id: studentId,
                        course_id: courseId,
                        assign_id: assignId,
                        total_tests: null,
                        earned: null,
                        comments: "",
                      });
                    });
                  });
                  await Grade.insertMany(grades);

                  return res
                    .status(200)
                    .json({  success: true ,message: "Data inserted successfully" });
                } catch (error) {
                  console.error(
                    "Error inserting data into the database:",
                    error
                  );
                  return res
                    .status(500)
                    .json({ message: "Error inserting data" });
                }
              });
          } else {
            return res.status(400).json({ message: "No assignment IDs found" });
          }
        });
    }
  );
};
