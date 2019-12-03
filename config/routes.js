// Set up dependencies
const scrape = require("../scripts/scrape");
const headlinesController = require("../controllers/headlines");
const notesController = require("../controllers/notes");

module.exports = function(router){
    // Route for Home
    router.get('/', function(req, res) {
        res.render('home');
    });
    // Route for Saved
    router.get('/saved', function(req, res) {
        res.render('saved');
    });
    // API route for fetching headlines
    router.get("/api/fetch", function(req, res) {
        headlinesController.fetch(function(err, docs){
            if(!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + "new articles"
                });
            }
        })
    });
    // Route to get headlines from database
    router.get("/api/headlines", function(req, res){
        let query = {};
        if (req.query.saved){
            query = req.query;
        }
        headlinesController.get(query, function(data){
            res.json(data);
        });
    });
    // Route to delete headline from database
    router.delete("/api/headlines/:id", function(req, res){
        let query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    // Route to update headline in database
    router.patch("/api/headlines", function(req, res){
        headlinesController.update(req.body, function(err, data){
            res.json(data);
        });
    });
    // Route to get notes from database
    router.get("/api/notes/:headline_id?", function(req, res){
        let query = {};
        if(req.params.headline_id){
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data){
            res.json(data);
        });
    });
    // Route to delete note from database
    router.delete("/api/notes/:id", function(req, res){
        let query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data){
            res.json(data);
        });
    });
    // Route to post new notes to articles
    router.post("/api/notes", function(req, res){
        notesController.save(req.body, function(data){
            res.json(data);
        });
    });
};