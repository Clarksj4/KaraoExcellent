var songDataReader = require('./songDataReader');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var createTable = function() {
	let query = "CREATE TABLE songDB (id Int, Number Int, Name Varchar, Artist Varchar)";
	db.run(query);
}

var fillTable = function(songsArray) {
	let query = "INSERT INTO songDB VALUES (?, ?, ?, ?)";
	var statement = db.prepare(query);

	// Add each song in array to db
	for (var i in songsArray) {
	  var song = songsArray[i];

	  statement.run({
	  	1: i,
	  	2: song[0],
	  	3: song[1],
	  	4: song[2]
	  });
	}

	// Execute statement
	statement.finalize();
}

exports.initialize = function(callback) {
	// Get songs from data reader
	songDataReader.getSongs(function(songsArray) {
		// Create database - serialize causes commands to be 
		// executed one after another
		db.serialize(function() {
			// Create, fill, and print table contents
			createTable();
			fillTable(songsArray);
		});

		// db has been initialized - execute callback
		callback();
	});	
}

exports.getByName = function(name) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Name = ?`;
	db.each(query, [name], function(err, row) {
		if (err) { console.log(err); }
		console.log(row.Number + ": " + row.Name + ", " + row.Artist);
	});
}

exports.getByPartialName = function(partialName) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Name LIKE '%` + partialName + `%'`;
	db.each(query, [], function(err, row) {
		if (err) { console.log(err); }
		console.log(row.Number + ": " + row.Name + ", " + row.Artist);
	});
}

exports.getByPartialArtist = function(partialArtistName) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Artist LIKE '%` + partialArtistName + `%'`;
	db.each(query, [], function(err, row) {
		if (err) { console.log(err); }
		console.log(row.Number + ": " + row.Name + ", " + row.Artist);
	});	
}

exports.getByPartialNameAndArtist = function(partialName, partialArtistName) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Name LIKE '%` + partialName + `%' AND 
						Artist LIKE '%` + partialArtistName + `%'`;
	db.each(query, [], function(err, row) {
		if (err) { console.log(err); }
		console.log(row.Number + ": " + row.Name + ", " + row.Artist);
	});	
}

exports.getByPartialNameArtistOrNumber = function(partialString) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Name LIKE '%` + partialString + `%' OR 
						Artist LIKE '%` + partialString + `%' OR
						Number LIKE '%` + partialString + `%'`;
	db.each(query, [], function(err, row) {
		if (err) { console.log(err); }
		console.log(row.Number + ": " + row.Name + ", " + row.Artist);
	});	
}

exports.getByPartialNameArtistOrNumber = function(partialString, onQueryExecuted) {
	let query = `SELECT Name, Number, Artist 
					FROM songDB 
					WHERE Name LIKE '%` + partialString + `%' OR 
						Artist LIKE '%` + partialString + `%' OR
						Number LIKE '%` + partialString + `%'`;
	db.all(query, [], function(err, rows) {
		if (err) { console.log(err); }
		onQueryExecuted(JSON.stringify(rows));
	});	
}

// TODO: get all results, wrap in json

exports.terminate = function() {
	// Close db
	db.close();
}