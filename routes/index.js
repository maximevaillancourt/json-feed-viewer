var express = require('express');
var router = express.Router();
var request = require("request");
var async = require("async")

/* GET home page. */
router.get('/',

  function ajaxRequest(req, res, next) {

    req.validFeed = false;

    if(req.query.feed_url){
      request(req.query.feed_url, function(err, requestResponse, rawData) {

        if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
          var data = JSON.parse(rawData);
          res.locals.data = data;
          req.validFeed = true
        }
        else{
          req.flash("error", "Invalid JSON feed.")
        }
      });
    }

    if(!req.validFeed){
      var showcaseFeedUrls = [
        //"https://jsonfeed.org/feed.json",
        "https://daringfireball.net/feeds/json",
        "http://inessential.com/feed.json"
      ]

      res.locals.showcaseFeeds = []

      var calls = [];

      showcaseFeedUrls.forEach(function(url){
        calls.push(function(callback) {
          request(url, function(err, requestResponse, rawData) {

            if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
              var data = JSON.parse(rawData);
              res.locals.showcaseFeeds.push(data);
              callback();
            }
            else{
              callback(err)
            }
            
          });
        }
      )});

      async.parallel(calls, function(err, result) {
        if(err){
          req.flash("error", "Invalid JSON feed.")
        }
        return next();
      });
    }
  },

  function render(req, res, next) {
    return res.render("index")
  }

);

module.exports = router;
