const express = require("express");

const app = express();


app.get("/", async (req, res) => {
	res.send({ message: "Hello World" });
});

console.log("Hello World was sent to the browser")
app.listen(5000);