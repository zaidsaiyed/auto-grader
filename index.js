const express = require("express");
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI, { useUnifiedTopology: true });  // Connect to the MongoDB

const app = express();

app.get("/", (req, res) => {
	res.send({ message: "This is kind of test for node-dev module" });
});

console.log("Hello World Zaid");
app.listen(2222, () => console.log("Server running on port 2222"));
