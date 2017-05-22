/*---------------------------------------------------------------------
  Dependencies
---------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var request = require("request");
var utils = require("../helpers/utils")

/*---------------------------------------------------------------------
  Feed Display GET
---------------------------------------------------------------------*/
router.get('/',

  function ajaxRequest(req, res, next) {

    // user has typed in something
    if(req.query.url){
      request(req.query.url.trim(), function(err, requestResponse, rawData) {

        // we have a response!
        if(requestResponse && requestResponse.headers){

          var feedType = null

          // check what mimetype we have
          utils.mimeTypes.forEach(function(m){
            if (requestResponse.headers["content-type"].indexOf(m.mimetype) > -1){
              feedType = m.feedtype;
            }
          })


          if(feedType == "json"){
            
            var parsedJson;
            
            res.locals.feedType = "json"

            try {
                parsedJson = JSON.parse(rawData);
            } catch(e) {
              req.flash("error", "Error while parsing the JSON feed.")
              return res.redirect("/");
            }
            var parsedJson = JSON.parse(rawData);
            if(parsedJson.hasOwnProperty('err')){
              req.flash("error", "There was an error while preparing the feed to be displayed.")
              return res.redirect("/");
            }
            else{
              // feed is ready to be displayed!
              res.locals.data = parsedJson;
              return next();
            }
          }

          else if(feedType == "xml"){

            res.locals.feedType = "xml"
            
            // we need convert the rss/atom feed to json first
            request("https://feed2json.org/convert?url="+encodeURIComponent(req.query.url.trim()), function(err, converterRequestResponse, converterRawData) {
              
              // we have a response from feed2json!
              if(converterRequestResponse && converterRequestResponse.headers){

                var convertedFeedType = null

                // check what mimetype we have
                utils.mimeTypes.forEach(function(m){
                  if (converterRequestResponse.headers["content-type"].indexOf(m.mimetype) > -1){
                    convertedFeedType = m.feedtype;
                  }
                })

                if(convertedFeedType == "json"){
                  var parsedConvertedJson;

                  try {
                      parsedConvertedJson = JSON.parse(converterRawData);
                  } catch(e) {
                    req.flash("error", "Error while parsing the converted feed.")
                    return res.redirect("/");
                  }
                  
                  if(parsedConvertedJson.hasOwnProperty('err')){
                    req.flash("error", "There was an error while preparing the feed to be displayed.")
                    return res.redirect("/");
                  }
                  else{
                    // feed is ready to be displayed!
                    res.locals.data = parsedConvertedJson;
                    return next();
                  }
                }
                else{
                  // converted data is not json
                  req.flash("error", "Error while converting the feed to JSON. Please try again.")
                  return res.redirect("/");
                }
              }
              else{
                // bad response from converter
                req.flash("error", "Invalid response from the feed converter. Please try again.")
                return res.redirect("/");
              }
            });
          }
          else{
            // not json, nor xml or atom
            req.flash("error", "Unexpected MIME type. Please make sure you are entering a JSON, RSS, or Atom feed URL.")
            return res.redirect("/");
          }
        }

        else{
          // we don't have a valid response
          req.flash("error", "Invalid response from this URL. Please try again.")
          return res.redirect("/");
        }
      });
    }

    // no user input
    else{
      return res.redirect("/");
    }
  },

  function render(req, res, next) {
    return res.render("feed")
  }

);

/*---------------------------------------------------------------------
  Exports
---------------------------------------------------------------------*/
module.exports = router;