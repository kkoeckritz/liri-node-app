// link required libs
var fs = require("fs");
var request = require("request");
var Twitter = require("node-twitter-api");
var Spotify = require("node-spotify-api");

// grab key configs
require("dotenv").config();
var keys = require("./keys.js");
console.log("done.")


function myTweets() {
    var a_token = null;
    var a_secret = null;

    // get new instance of twitter ( THIS MIGHT BE ALL THAT IS NEEDED!!!!!!!!!!!!!!!!!! )
    var twitter = new Twitter(keys.twitter);

    // get request token
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        }
        else {
            // get access token
            twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
                if (error) {
                    console.log(error);
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

    spotify.search({ type: 'track', query: name })
        .then(function(response) {
            console.log("____________________");
            console.log(`artist: ${response.tracks.items[0].album.artists[0].name}`);
            console.log(`track: ${response.tracks.items[0].name}`);
            console.log(`album: ${response.tracks.items[0].album.name}`);
            console.log(`Spotify link: ${response.tracks.items[0].external_urls.spotify}`);
            console.log("____________________");
        })
        .catch(function(err) {
            console.log(err);
        });
}

function movieThis(name) {
    // default to "Mr. Nobody"
    if (name == null) {
        name = "Mr. Nobody";
    }

    request(`http://omdbapi.com/?t=${name}&y=&plot=short&apikey=${keys.omdb.key}`, function(error, response){
        if (!error && response.statusCode == 200) {
            var movie_title = JSON.parse(response.body).Title;
            var movie_year = JSON.parse(response.body).Year;
            var movie_rating = JSON.parse(response.body).imdbRating;
            var movie_tomatoes = JSON.parse(response.body).Ratings[1].Source;
            var movie_country = JSON.parse(response.body).Country;
            var movie_language = JSON.parse(response.body).Language;
            var movie_plot = JSON.parse(response.body).Plot;
            var movie_actors = JSON.parse(response.body).Actors;

            console.log("____________________");
            console.log(`title: ${movie_title}`);
            console.log(`year: ${movie_year}`);
            console.log(`rating: ${movie_rating}`);
            console.log(`Rotten Tomatoes: ${movie_tomatoes}`);
            console.log(`Country: ${movie_country}`);
            console.log(`Language: ${movie_language}`);
            console.log(`Plot: ${movie_plot}`);
            console.log(`Actors: ${movie_actors}`);
            console.log("____________________");
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
        spotifyThisSong(name);
        break;
    case "movie-this":
        movieThis(name);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("\n_____usage_____");
        console.log("'my-tweets'");
        console.log("'spotify-this-song <song>'");
        console.log("'movie-this <movie>'");
        console.log("'do-what-it-says'\n");
}
