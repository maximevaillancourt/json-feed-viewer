var express = require('express');
var router = express.Router();
var request = require("request");
var async = require("async");

/* GET home page. */
router.get('/',

  function ajaxRequest(req, res, next) {

    req.validFeed = false;

    if(req.query.feed_url){
      request(req.query.feed_url.trim(), function(err, requestResponse, rawData) {

        if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
          var data = JSON.parse(rawData);
          res.locals.data = data;
          req.validFeed = true
          return next();
        }
        else{
          req.flash("error", "Invalid JSON feed.")
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
        "https://www.raymondcamden.com/jsonfeed/index.json",
        "https://longstride.net/feed.json",
        "https://ryanmo.co/feed.json",
        "http://troz.net/feed.json",
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
          //req.flash("error", "Invalid JSON feed.")
        }
        return next();
      });
    }

  },

  function render(req, res, next) {

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    if(res.locals.showcaseFeeds){
      shuffle(res.locals.showcaseFeeds)
    }

    return res.render("index")
  }

);

module.exports = router;