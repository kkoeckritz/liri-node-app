// link required libs
var fs = require("fs");
var request = require("request");
var Twitter = require("node-twitter-api");
var Spotify = require("node-spotify-api");

// grab key configs
require("dotenv").config();
var keys = require("./keys.js");

// Twitter mode
function myTweets() {
    var a_token = null;
    var a_secret = null;

    // get new instance of twitter ( THIS MIGHT BE ALL THAT IS NEEDED!!!!!!!!!!!!!!!!!! )
    var twitter = new Twitter(keys.twitter);

    // get request token
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            logOut(1,"Error getting OAuth request token : " + error);
        }
        else {
            // get access token
            twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
                if (error) {
                    logOut(1,error);
                }
                else {
                    a_token = accessToken;
                    a_secret = accessTokenSecret;
                }
            });
        }
    });
}

// Spotify mode
function spotifyThisSong(name) {
    var spotify = new Spotify(keys.spotify);

    // default to "Ace of Base - The Sign"
    if (name == null) {
        name = "Ace of Base The Sign";
    }

    // find, output data from Spotify
    spotify.search({ type: 'track', query: name })
        .then(function(response) {
            logOut(1,`artist: ${response.tracks.items[0].album.artists[0].name}`);
            logOut(1,`track: ${response.tracks.items[0].name}`);
            logOut(1,`album: ${response.tracks.items[0].album.name}`);
            logOut(1,`Spotify link: ${response.tracks.items[0].external_urls.spotify}`);
        })
        .catch(function(err) {
            logOut(1,err);
        });
}

// OMDB mode
function movieThis(name) {
    
    // default to "Mr. Nobody"
    if (name == null) {
        name = "Mr. Nobody";
    }

    // get, output data from OMDB
    request(`http://omdbapi.com/?t=${name}&y=&plot=short&apikey=${keys.omdb.key}`, function(error, response){
        if (!error && response.statusCode == 200) {
            var movie_title = JSON.parse(response.body).Title;
            var movie_year = JSON.parse(response.body).Year;
            var movie_rating = JSON.parse(response.body).imdbRating;

            // Rotten Tomatoes rating sometimes does not exist
            if (JSON.parse(response.body).Ratings[1] == undefined) {
                var movie_tomatoes = "NOT FOUND.";
            }
            else {
                var movie_tomatoes = JSON.parse(response.body).Ratings[1].Source;
            }
            
            var movie_country = JSON.parse(response.body).Country;
            var movie_language = JSON.parse(response.body).Language;
            var movie_plot = JSON.parse(response.body).Plot;
            var movie_actors = JSON.parse(response.body).Actors;

            logOut(1,`title: ${movie_title}`);
            logOut(1,`year: ${movie_year}`);
            logOut(1,`rating: ${movie_rating}`);
            logOut(1,`Rotten Tomatoes: ${movie_tomatoes}`);
            logOut(1,`Country: ${movie_country}`);
            logOut(1,`Language: ${movie_language}`);
            logOut(1,`Plot: ${movie_plot}`);
            logOut(1,`Actors: ${movie_actors}`);
        }
        else {
            logOut(1,error);
        }
    });
}

// run inputs from random.txt instead
function doWhatItSays() {

    console.log("Doing what it says...\n");
    fs.readFile("random.txt", "utf8", function(error, data) {

        // log any errors to console
        if (error) {
          return logOut(1,error);
        }
      
        // split "paramaters" at comma
        var cmdArr = data.split(",");

        // call chooseMode again with new params
        chooseMode(cmdArr[0], cmdArr[1]);
      });
}

// determine functionality based on inputs
function chooseMode(mode, name) {
    switch(mode) {
        case "my-tweets":
            // log commands with logOut
            logOut(0, `${mode}`);

            myTweets();
            break;

        case "spotify-this-song":
            // log commands with logOut
            logOut(0, `${mode} ${name}`);

            spotifyThisSong(name);
            break;

        case "movie-this":
            // log commands with logOut
            logOut(0, `${mode} ${name}`);

            movieThis(name);
            break;

        case "do-what-it-says":
            // log commands with logOut
            logOut(0, `${mode}`);

            doWhatItSays();
            break;

        default:
            logOut(1, "_____usage_____");
            logOut(1, "'my-tweets'");
            logOut(1, "'spotify-this-song <song>'");
            logOut(1, "'movie-this <movie>'");
            logOut(1, "'do-what-it-says'");
    }
}

// write to log.txt, console
function logOut(type, text) {

    // for commands
    if (type == 0) {

        // write text to file...
        fs.appendFile("log.txt", `${text}:\n`, function(err) {

            if (err) {
            console.log(err);
            }
        });             
    }

    // for output
    else {

        // write text to file...
        fs.appendFile("log.txt", `\t${text}\n`, function(err) {

            if (err) {
            console.log(err);
            }
        
            // ...and output text to console 
            console.log(text);
        });       
    }
}

// send cmdline args to chooseMode
var mode = process.argv[2];
var name = process.argv[3];
chooseMode(mode, name);
