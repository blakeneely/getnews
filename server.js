// Set up dependencies
const express = require("express");

// Set up port for Heroku
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Set up Express router
const router = express.Router();
app.use(router);

// Make public a static folder
app.use(express.static("public"));

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});