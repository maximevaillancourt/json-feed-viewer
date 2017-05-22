/*---------------------------------------------------------------------
  Dependencies
---------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var request = require("request");
var async = require("async");
var utils = require("../helpers/utils")

/*---------------------------------------------------------------------
  Homepage GET
---------------------------------------------------------------------*/
router.get('/',

  // backward compatibility with previously used URL (...herokuapp.com/?feed_url=http...)
  function redirectToFeed(req, res, next){
    if(req.query.feed_url){
      return res.redirect("/feed/?url="+encodeURIComponent(req.query.feed_url.trim()))
    }
    else{
      return next();
    }
  },

  function getShowcasedFeeds(req, res, next){

    res.locals.showcasedFeeds = []

    var calls = [];

    utils.showcasedFeedsUrls.forEach(function(url){
      calls.push(function(callback) {
        request(url.trim(), function(err, requestResponse, rawData) {

          if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
            var data = JSON.parse(rawData);
            res.locals.showcasedFeeds.push(data);

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
  },

  function render(req, res, next) {
    utils.shuffleArray(res.locals.showcasedFeeds)
    return res.render("index")
  }

);

/*---------------------------------------------------------------------
  Exports
---------------------------------------------------------------------*/
module.exports = router;