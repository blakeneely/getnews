module.exports = function(router){
    // Route for Home
    router.get('/', function (req, res) {
        res.render('home');
    });
    // Route for Saved
    router.get('/saved', function (req, res) {
        res.render('saved');
    });
};