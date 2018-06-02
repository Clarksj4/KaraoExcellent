// User http module
var http = require('http');
var url = require('url');
var songManager = require('./SongManager');

// Initialise
songManager.initialize(function() {
	// DO nothing
});

// Creates a server response
var requestListener = function(request, response)
{
	var q = url.parse(request.url, true);
	var qData = q.query;

	console.log("string = " + qData.string + ", name = " + qData.songName + ", artist = " + qData.songArtist);

	songManager.getByPartialNameArtistOrNumber(qData.string, function(data) {
		response.writeHead(200, {'Content-Type' : 'application/json'});
		response.write(data);
		return response.end();
	});
	
	// if (qData.string != undefined) {
	// 	songManager.getByPartialNameArtistOrNumber(qData.string);
	// }

	// else if (qData.songName != undefined && qData.songArtist != undefined) {
	// 	songManager.getByPartialNameAndArtist(qData.songName, qData.songArtist);
	// }

	// else if (qData.songName != undefined) {
	// 	songManager.getByPartialName(qData.songName);
	// }

	// else if (qData.songArtist != undefined) {
	// 	songManager.getByPartialArtist(qData.songArtist);
	// } 
	
	// response.writeHead(200, {'Content-Type': 'text/html'});
	// response.write(data);
	// response.end();
}

// Create a server object for providing the above response
// List on port 8080
var server = http.createServer(requestListener);
server.listen(8080);