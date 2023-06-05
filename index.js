const express = require("express");

const app = express();


app.get("/", async (req, res) => {
	res.sendFile(__dirname + "/index.html");
});


console.log("Hello World")
app.listen(5000);