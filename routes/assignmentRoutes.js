const mongoose = require("mongoose");
const fs = require("fs-extra");
const Assignment = mongoose.model("assignment");
const multer = require("multer");


// Set up multer storage 2
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const courseId = req.params.courseId;
    const assignId = req.params.assignId;
    const folderPath = `./courses/${courseId}/${assignId}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, "unit_test.py");
  },
});

// Create multer upload instance 2
const upload2 = multer({ storage: storage2 });

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

  // Create a new assignment
  app.post("/api/assignment", async (req, res) => {
    try {
      const newAssignment = new Assignment(req.body);
      const savedAssignment = await newAssignment.save();
      res.json(savedAssignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete an assignment by courseID and AssignID
  app.delete("/api/assignment/del/:courseID/:AssignID", async (req, res) => {
    const { courseID, AssignID } = req.params;

    try {
      // Find the assignment by courseID and AssignID
      const assignment = await Assignment.findOneAndDelete({
        course_id: courseID,
        assign_id: AssignID,
      });

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

  // Softcheck upload

  // Set up multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const assignId = req.body.assignId;
      // do the same thing that is required for the unit test file

      const FolderPath = `./softcheck_uploads`;
      if (!fs.existsSync(FolderPath)) {
        fs.mkdirSync(FolderPath);
      }
      cb(null, FolderPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // Create multer upload instance
  const upload = multer({ storage });

  app.post("/api/assign/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const assignId = req.body.assignId;
    // get course name
    // Search for folder inside courses folder
    // use this to create a script path for python to cgheck the uploaded fill

    // Define the path to the Python script
    const pythonScriptPath = "softcheck_uploads/stu_final_unit_tests.py";

    // Execute the Python script as a child process
    const { exec } = require("child_process");
    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        res.status(500).json({ message: "Error executing Python script" });
        return;
      }

      // Process the output from the Python script
      //console.log(`Python script output: ${stdout}`);
      const result = stdout;
      res.json({ success: true, result: result });
    });

    setTimeout(() => {
      fs.unlink(req.file.path, (error) => {
        if (error) {
          console.error(`Error deleting file: ${error}`);
          return;
        }
        console.log("File deleted successfully");
      });
    }, 5000);
  });


  // Set up multer storage for prof assignment upload
  const prof_ass_storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const assignId = req.body.assignId;
      // do the same thing that is required for the unit test file

      const FolderPath = `./softcheck_uploads`;
      if (!fs.existsSync(FolderPath)) {
        fs.mkdirSync(FolderPath);
      }
      cb(null, FolderPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // Create multer upload instance
  const profupload = multer({ storage : prof_ass_storage });

  app.post("/api/profAssign/upload", profupload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const assignId = req.body.assignId;
    // get course name
    // Search for folder inside courses folder
    // use this to create a script path for python to cgheck the uploaded fill

    // Define the path to the Python script
    
    
    // setTimeout(() => {
      //   fs.unlink(req.file.path, (error) => {
    //     if (error) {
    //       console.error(`Error deleting file: ${error}`);
    //       return;
    //     }
    //     console.log("File deleted successfully");
    //   });
    // }, 5000);
  });
  
  // Child process to execute Python script
  
  app.post('/api/runPy', (req, res) => {
    const { exec } = require("child_process");
    const pythonScriptPath = "softcheck_uploads/final_unzip.py";
    exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        res.status(500).json({ message: "Error executing Python script" });
        return;
      }
      // Process the output from the Python script
      //console.log(`Python script output: ${stdout}`);
      const result = stdout;
      res.json({ success: true, result: result });
    });
});





app.put(
  "/api/assignment/:courseId/:assignId",
    upload2.single("unitTestFile"),
    async (req, res) => {
      const { courseId, assignId } = req.params; // Extract the courseId and assignId

      try {
        const updatedAssignment = await Assignment.findOneAndUpdate(
          { course_id: courseId, assign_id: assignId }, // Filter
          {
            $set: {
              description: req.body.description,
              required_files: req.body.requiredFiles,
              total_tests: req.body.totalTests,
            },
          }, // Update
          { new: true } // Options: Return the updated assignment
        );

        if (!updatedAssignment) {
          res.status(404).json({ message: "Assignment not found" });
          return;
        }

        res.json(updatedAssignment);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );
};
