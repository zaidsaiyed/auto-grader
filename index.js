const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true });  // Connect to the MongoDB

require("./models/User"); // Load the User model

const app = express();

require("./routes/userRoutes")(app); // Load the user routes

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/registration", (req, res) => {
	res.sendFile(__dirname + "/registration.html");
});

console.log("Hello World Zaid");
app.listen(2222, () => console.log("Server running on port 2222. Visit http://localhost:2222/"));
