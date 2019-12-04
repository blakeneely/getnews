// Set up dependencies
const makeDate = require("../scripts/date");
const Note = require("../models/Note");

module.exports = {
    get: function(data, callback){
        Note.find({
            _headlineID: data._id
        }, callback);
    },
    save: function(data, callback){
        let newNote = {
            _headlineID: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        Note.create(newNote, function(err, doc){
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                callback(doc);
            }
        });
    },
    delete: function(data, callback){
        Note.deleteOne({
            _id: data._id
        }, callback);
    }
};
