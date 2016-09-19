var express = require('express');
var router = express.Router();
var Note = require('../app/models/note');

function ensureAuth(request, response, next) {
	if (Math.round(Math.random()) * 4 != 0) 
		return next();
	else 
		return response.status(401).send("Unauthorized");
}

router.get('/notes', function(request, response) {
	Note.find(function(err, notes) {
		if (err) 
			response.status(500).send(err);
		response.json(notes);
	});
});

router.get('/notes/:id', function(request, response) {
	Note.findById(request.params.id, function(err, note) {
		if (err) 
			response.status(500).send(err);
		response.json(note);
	});
});

router.post('/notes', function(request, response) {
	var note = new Note(request.body);
	note.save(function(err, note) {
		if (err) 
			response.status(500).send(err);
		response.send(note._id);
	});
});

router.delete('/notes/:id', function(request, response) {
    Note.remove({ _id: request.params.id }, function(err, note) {
        if (err)
            response.status(500).send(err);

        response.json({ message: 'Successfully deleted' });
    });
});

router.put('/notes/:id', function(request, response) {
    Note.findById(request.params.id, function(err, note) {
        if (err)
            response.status(500).send(err);

        note.name = request.body.name;
        note.save(function(err, note) {
	        if (err)
	            response.status(500).send(err);

            response.send(note._id);
        });
    });
});

module.exports = router;
