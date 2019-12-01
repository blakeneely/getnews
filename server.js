// Set up dependencies
const express = require("express");
const expressHandlebars = require("express-handlebars");
const mongoose = require("mongoose");

// Set up port for Heroku
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Set up Express router
const router = express.Router();
app.use(router);

// Make public a static folder
app.use(express.static("public"));

// Connect Handlebars to Express app
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to MongoDB
// If deployed use deployed database, otherwise use getNewsHeadlines database
const db = process.env.MONGODB_URI || "mongodb://localhost/getNewsHeadlines"

// Connect Mongoose to database
mongoose.connect(db, function(error){
    if(error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection successful");
    }
});

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.render('home');
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});