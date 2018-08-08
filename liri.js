require("dotenv").config();
var fs = require("fs");
var request = require("request");

// grab key configs
var keys = require("./keys.js");
// var spotify = new Spotfy(keys.spotify);
// var client = new Twitter(keys.twitter);

function myTweets() {

}

function spotifyThisSong() {

}

function movieThis(name) {
    request(`http://omdbapi.com/?t=${name}&y=&plot=short&apikey=${keys.omdb.key}`, function(error, response){
        if (!error && response.statusCode == 200) {
            var movie_rating = JSON.parse(response.body).imdbRating;

            console.log(movie_rating);
        }
        else {
            console.log(error);
        }
    });
}

function doWhatItSays() {

}

// determine app mode from first parameter
var mode = process.argv[2];
var name = process.argv[3];
switch(mode) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis(name);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("_____usage_____");
        console.log("'my-tweets'");
        console.log("'spotify-this-song <song>'");
        console.log("'movie-this <movie>'");
        console.log("'do-what-it-says'");
}
