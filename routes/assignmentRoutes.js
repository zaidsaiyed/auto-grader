const mongoose = require("mongoose");
const fs = require("fs-extra");
const Assignment = mongoose.model("assignment");
const Grade = mongoose.model("grade");
const multer = require("multer");
const path = require('path');
const fs1 = require('fs');


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
    cb(null, "final_unit_tests.py");
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
      const folderPath = `./courses/${courseID}/${AssignID}`;
      await fs.remove(folderPath);


      //Delete related grades
      await Grade.deleteMany({
        assign_id: AssignID
      });

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

    // const {assignId, courseId} = req.params;
    const assignId = req.body.assignId;
    const courseId = req.body.courseId;

    // copying test file for python from Assignment folder

    const filepath = `./courses/${courseId}/${assignId}`

    const sourceFile = path.join(filepath, 'final_unit_tests.py'); // Replace 'source_folder' with your source folder path and 'file.txt' with the filename you want to copy.
    const destinationFile = path.join('./softcheck_uploads', 'final_unit_tests.py'); // Replace 'destination_folder' with your destination folder path and 'file.txt' with the desired filename in the destination folder.

    fs1.copyFile(sourceFile, destinationFile, (err) => {
    if (err) {
      console.error('Error copying file:', err);
      return res.status(500).send('Error copying file.');
    }
    
    const newfilepath = `./courses/${courseId}`

    const sourceFile = path.join(newfilepath, 'Test1.csv'); // Replace 'source_folder' with your source folder path and 'file.txt' with the filename you want to copy.
    const destinationFile = path.join('./softcheck_uploads', 'Test1.csv'); // Replace 'destination_folder' with your destination folder path and 'file.txt' with the desired filename in the destination folder.

    fs1.copyFile(sourceFile, destinationFile, (err) => {
    if (err) {
      console.error('Error copying file:', err);
      return res.status(500).send('Error copying file.');
    }
  });
    
    // Create the text content with courseId and assignId
    const textData = `Course ID: ${courseId}, Assignment ID: ${assignId}\n`;

    // Get the file path of the uploaded file
    const uploadedFilePath = req.file.path;

    // Create a new text file in the same folder as the uploaded file
    const newFileName = 'grades.txt';
    const newFilePath = path.join(path.dirname(uploadedFilePath), newFileName);

    // Write the text content into the new text file
    fs.writeFile(newFilePath, textData, (err) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, error: 'Error creating the text file.' });
      }

      // File creation successful
      return res.json({ success: true, message: 'Text file created successfully.' });
    });
  });

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

// Move csv file to course folder
app.post('/api/movCSV', (req, res) => {

  const courseId = req.body.courseId;
  console.log(courseId);

  // copying test file for python from Assignment folder

  const filepath = `./courses/${courseId}`

  const destinationFile = path.join(filepath, `${courseId}.csv`); // Replace 'source_folder' with your source folder path and 'file.txt' with the filename you want to copy.
  const sourceFile = path.join('./softcheck_uploads', `${courseId}.csv`); // Replace 'destination_folder' with your destination folder path and 'file.txt' with the desired filename in the destination folder.

  fs1.copyFile(sourceFile, destinationFile, (err) => {
  if (err) {
    console.error('Error copying file:', err);
    return res.status(500).send('Error copying file.');
  }
});
});




// Route to update assignment and update total_tests in grades
  app.put("/api/assignment/:courseId/:assignId", upload2.single("unitTestFile"), async (req, res) => {
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

      // Update total_tests in grades collection for this assignment
      await Grade.updateMany(
        { course_id: courseId, assign_id: assignId }, // Filter
        { $set: { total_tests: req.body.totalTests } } // Update
      );

      res.json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};