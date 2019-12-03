// Set up dependencies
const scrape = require("../scripts/scrape");
const makeDate = require("../scripts/date");
const Headline = require("../models/Headline");

module.exports = {
    fetch: function(callback){
        scrape(function(data){
            let articles = data;
            for(let i = 0; i < articles.length; i++){
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            Headline.collection.insertMany(articles, {ordered:false}, function(err, docs){
                callback(err, docs)
            });
        });
    },
    delete: function(query, callback){
        Headline.remove(query, callback);
    },
    get: function(query, callback){
        Headline.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc){
            callback(doc);
        });
    },
    update: function(query, callback){
        Headline.updateOne({_id: query._id}, {
            $set: query
        }, {}, callback);
    }
};
