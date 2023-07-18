const mongoose = require("mongoose");
const fs = require("fs-extra");
const Assignment = mongoose.model("assignment");
const fs = require("fs");
const multer = require("multer");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FolderPath = `./softcheck_uploads`
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



  app.post("/api/assgn/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    
    // Define the path to the Python script
    const pythonScriptPath = 'softcheck_uploads/pri_test.py';
  
    // Execute the Python script as a child process
    const { exec } = require('child_process');
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
        console.log('File deleted successfully');
      });
      
    }, 5000);
  


  });
  
};