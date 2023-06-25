const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');
const fs = require('fs'); // File system module
const multer = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true });  // Connect to the MongoDB

require("./models/User"); // Load the User model
require("./models/Course"); // Load the Course model
require("./models/Assignment"); // Load the Assignment model
require("./models/Grade"); // Load the Grades model

const app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


require("./routes/userRoutes")(app); // Load the user routes
require("./routes/courseRoutes")(app); // Load the course routes
require("./routes/assignmentRoutes")(app); // Load the assignment routes
require("./routes/gradeRoutes")(app); // Load the grades routes


// Set up storage for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
	  cb(null, file.originalname);
	}
  });
  

const upload = multer({ storage }); // Set up multer

app.set('views', './views');
app.set('view engine', 'ejs');

// This is test code for uploading files

app.post('/uploadfile', upload.single('file'), (req, res) => {
	if (!req.file) {
	  return res.status(400).send('No file uploaded');
	}
	
	const filePath = req.file.path;
  
	fs.readFile(filePath, 'utf8', (err, data) => {
	  if (err) {
		console.error(err);
		return res.status(500).send('Error reading file');
	  }
  
	  res.render('index', { fileContent: data });
	});
  });
  
  app.get('/count_lines', (req, res) => {
	if (!req.query.fileContent) {
	  return res.status(400).send('No file content provided');
	}
  
	const lines = req.query.fileContent.split('\n');
	const lineCount = lines.length;
	res.send(lineCount.toString());
  });

  // End of test code

// Get the default connection
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/userDetails.html");
});

// Get registration page
app.get("/registration", (req, res) => {
	res.sendFile(__dirname + "/userfunctions/registration.html");
});

// Get login page
app.get("/login", (req, res) => {
	res.sendFile(__dirname + "/userfunctions/login.html");
});

// Get create course page
app.get("/createCourse", (req, res) => {
	res.sendFile(__dirname + "/coursefunctions/createcourse.html");
});

// Get file Upload page
app.get("/upload", (req, res) => {
	res.sendFile(__dirname + "/Test and trials/tryPy.html");
});


	

app.get("/api/redirect", (req, res) => {
	res.sendFile(__dirname + "/redirect.html");
});

console.log("Hello World Zaid");
app.listen(2222, () => console.log("Server running on port 2222. Visit http://localhost:2222/"));
