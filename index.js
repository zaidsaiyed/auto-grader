const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const fs = require("fs"); // File system module
const multer = require("multer"); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true }); // Connect to the MongoDB

require("./models/User"); // Load the User model
require("./models/Course"); // Load the Course model
require("./models/Assignment"); // Load the Assignment model
require("./models/Grade"); // Load the Grades model

const app = express();
app.use(express.static("public"));

const bodyParser = require("body-parser"); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

require("./routes/userRoutes")(app); // Load the user routes
require("./routes/courseRoutes")(app); // Load the course routes
require("./routes/assignmentRoutes")(app); // Load the assignment routes
require("./routes/gradeRoutes")(app); // Load the grades routes

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // Set up multer

app.set("views", "./views");
app.set("view engine", "ejs");

// This is test code for uploading files

app.post("/uploadfile", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }

    res.render("index", { fileContent: data });
  });
});

app.get("/count_lines", (req, res) => {
  if (!req.query.fileContent) {
    return res.status(400).send("No file content provided");
  }

  const lines = req.query.fileContent.split("\n");
  const lineCount = lines.length;
  res.send(lineCount.toString());
});

// End of test code

// Landing Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/userfunctions/landing.html");
});

// Get registration page
app.get("/registration", (req, res) => {
  res.sendFile(__dirname + "/userfunctions/registration.html");
});

//Get Success page
app.get("/registration-success", (req, res) => {
  res.sendFile(__dirname + "/userfunctions/registrationsuccess.html");
});

// Get prof registration page
app.get("/profRegistration", (req, res) => {
  res.sendFile(__dirname + "/userfunctions/profRegistration.html");
});

// Get login page
app
  .route("/login")
  .get((req, res) => {
    res.sendFile(__dirname + "/userfunctions/login.html");
  })
  .post((req, res) => {
    console.log(req.body.username);

    fetch("/api/user")
      .then((response) => response.json())
      .then((users) => {
        var matchingUser = users.find(
          (user) =>
            user.user_name === req.body.username &&
            user.password === req.body.password
        );

        if (matchingUser) {
          // Redirect to the appropriate dashboard with user_name as a parameter
          var userType = matchingUser.types;
          if (userType === "S")
            window.location.href =
              "/studentdashboard?username=" + encodeURIComponent(username);
          else if (userType === "P")
            window.location.href =
              "/professordashboard?username=" + encodeURIComponent(username);
          else if (userType === "A") window.location.href = "/admin";
          else {
            // Invalid user type
            error.innerHTML = "Invalid user type.";
          }
        } else {
          // Login failed, display error message
          error.innerHTML = "Invalid username or password.";
        }
      })
      .catch((error) => {
        // Error occurred during login
        error.innerHTML = "An error occurred. Please try again.";
        console.log(error);
      });
    //res.sendFile(__dirname + "/userfunctions/login.html?err=");
  });

// Get create course page
app.get("/createCourse", (req, res) => {
  res.sendFile(__dirname + "/coursefunctions/createcourse.html");
});

//Get Admin page
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/Dashboards/adminDashboard.html");
});

//Get Prof page
app.get("/professordashboard", (req, res) => {
  res.sendFile(__dirname + "/Dashboards/profDashboard.html");
});

//Get Student page
app.get("/studentdashboard", (req, res) => {
  res.sendFile(__dirname + "/Dashboards/studDashboard.html");
});

//Get Student course page
app.get("/course", (req, res) => {
  res.sendFile(__dirname + "/coursefunctions/coursepage.html");
});

//Get Prof course page
app.get("/profcourse", (req, res) => {
  res.sendFile(__dirname + "/coursefunctions/profcoursepage.html");
});

//Get Prof Assignment page
app.get("/profassignment", (req, res) => {
  res.sendFile(__dirname + "/assignfunctions/profassign.html");
});

// Get Student Assignment page
app.get("/studentassignmentchecker", (req, res) => {
  const assignId = req.query.assignId; 
  res.sendFile("/assignfunctions/studentAssignChecker.html", {
    root: __dirname,
    query: {
      assignId: assignId
    }
  });
});
// Get Professor Assignment Checker page
app.get("/profassignmentchecker", (req, res) => {
  const assignId = req.query.assignId; 
  res.sendFile("/assignfunctions/profAssignChecker.html", {
    root: __dirname,
    query: { assignId : assignId }
  });
});

//Get Update Assignment page
app.get("/updateassignment", (req, res) => {
  res.sendFile(__dirname + "/assignfunctions/updateassign.html");
});

// Get file Upload page
app.get("/upload", (req, res) => {
  res.sendFile(__dirname + "/Test_trials/tryPy.html");
});

//Edit Individual Grade
app.get("/editgrade", (req, res) => {
  res.sendFile(__dirname + "/assignFunctions/editgrade.html");
});


// Test test test
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/assignfunctions/studentAssign.html");
});

console.log("\n************************************************************");

app.listen(2222, () =>
  console.log("Server running on port 2222. Visit http://localhost:2222/")
);
