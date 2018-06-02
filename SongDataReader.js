// Module gets songs from local csv file - splitting and
// trimming strings as necessary

var lineReaderModule = require('line-by-line');

var SONGS_PATH = "./KaraokeSongs.csv";

var tidyLine = function(line) {
	// Split line on ',' - each array entry is a song param
	var splitLine = line.split(",");
	var tidiedSplitLine = [];

	tidiedSplitLine[0] = splitLine[0];
	tidiedSplitLine[1] = splitLine[1].split("\"").join("");
	tidiedSplitLine[2] = splitLine[2].split("\"").join("");

	// Return tidied song params
	return tidiedSplitLine;
}

exports.getSongs = function(callback) {
	// Read one line at a time
	// Skip first line
	// Split each line on ","
	// Remove " from string

	var lineReader = new lineReaderModule(SONGS_PATH);
	var lineCount = 0;
	var songArray = [];

	// Error event listener
	lineReader.on('err', function (err) {
		console.log(err)
	});

	// Line read event listener - line contains the current line
	// without the trailing newline character
	lineReader.on('line', function (line) {
		// Skip the first line - it contains headers
		if (lineCount > 0) {
			var songParams = tidyLine(line);
			songArray.push(songParams);
		}

		lineCount++;
	});

	// All lines read event listener
	lineReader.on('end', function() {
		callback(songArray);
	});
}
