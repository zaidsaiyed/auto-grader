const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true });  // Connect to the MongoDB

require("./models/User"); // Load the User model
require("./models/Course"); // Load the User model

const app = express();

const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


require("./routes/userRoutes")(app); // Load the user routes
require("./routes/courseRoutes")(app); // Load the course routes
// Get the default connection
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

// Get registration page
app.get("/registration", (req, res) => {
	res.sendFile(__dirname + "/registration.html");
});

console.log("Hello World Zaid");
app.listen(2222, () => console.log("Server running on port 2222. Visit http://localhost:2222/"));
