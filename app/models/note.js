var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to local mongo db');
});

var noteSchema = mongoose.Schema({
	name: String
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;