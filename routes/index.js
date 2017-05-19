var express = require('express');
var router = express.Router();
var request = require("request");
var async = require("async")

/* GET home page. */
router.get('/',

  function ajaxRequest(req, res, next) {

    req.validFeed = false;

    if(req.query.feed_url){
      request(req.query.feed_url.trim(), function(err, requestResponse, rawData) {

        if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
          var data = JSON.parse(rawData);
          res.locals.data = data;
          console.log("feed url request complete")
          req.validFeed = true
          return next();
        }
        else{
          //req.flash("error", "Invalid JSON feed.")
          return getShowcasedFeeds();
        }
      });
    }
    else{
      return getShowcasedFeeds();
    }

    function getShowcasedFeeds(){
      var showcaseFeedUrls = [
        "https://jsonfeed.org/feed.json",
        "https://daringfireball.net/feeds/json",
        "http://inessential.com/feed.json",
        "http://phish.net/feed.json",
        "https://www.stuartbreckenridge.com/feed.json",
        "https://applefocus.com/feed.json",
        "http://www.downes.ca/news/OLDaily.json",
        //"https://pxlnv.com/feed/json/",
        //"http://uncrate.com/feed.json",
        //"http://www.vienna-rb.at/new-blog/feed.json"
      ]

      res.locals.showcaseFeeds = []

      var calls = [];

      showcaseFeedUrls.forEach(function(url){
        calls.push(function(callback) {
          request(url.trim(), function(err, requestResponse, rawData) {

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
    console.log("rendering page")
    return res.render("index")
  }

);

module.exports = router;
