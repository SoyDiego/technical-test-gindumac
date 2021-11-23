const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));


// Route credits
app.get("/credits", function (req, res) {
	res.send("Technical test for GINDUMAC By Diego Franchina");
});

// Route not found (404)
app.use(function (req, res) {
	return res
		.status(404)
		.send({ error: true, message: "ERROR 404! - Route " + req.url + " Not found." });
});

// Init server
app.listen(5000, () => {
	console.log("Server started on port 5000");
});
