$(function() {
	window.root = new NotesViewModel();
	ko.applyBindings(window.root);
});

function NotesViewModel() {
	var self = this;

	self.notes = ko.observableArray();

	self.newName = ko.observable();
	
	self.addNote = function() {
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				name: self.newName()
			}),
			url: '/api/notes',
			success: function(data) {
				showSuccessMessage('Note ' + data + 'succesfully added');
				self.initialize();
			},
			error: errorCallback
		})
	}

	self.initialize = function() {
		self.notes([]);
		$.getJSON('/api/notes', {}, function(data) {
			$.each(data, function(index, element) {
				self.notes.push(new NoteViewModel(element));
			});
		}).fail(errorCallback);
	}

	self.initialize();
}

function NoteViewModel(data) {
	var self = this;
	
	self.name = ko.observable(data.name);
	self.id = ko.observable(data._id);

	self.update = function() {
		var data = {
			name: self.name()
		};
		$.ajax({
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(data),
			url: '/api/notes/' + self.id(),
			success: function(data) {
				showSuccessMessage('Record ' + self.id() + ' succesfully updated');
			},
			error: errorCallback
		});
	};

	self.remove = function() {
		$.ajax({
			type: 'DELETE',
			contentType: 'application/json',
			url: '/api/notes/' + self.id(),
			success: function(data) {
				window.root.initialize();
				showSuccessMessage('Record ' + self.id() + ' succesfully deleted');
			},
			error: errorCallback
		});
	};
}

function errorCallback(resp) {
	showFailureMessage(resp.responseText);
}

function showSuccessMessage(text) {
    showNotificationMessage(text, 'confirmation-message');
}

function showFailureMessage(text) {
    showNotificationMessage(text, 'confirmation-message-failure');
}

function showNotificationMessage(text, messageClass) {
    function closeConfirmation() {
        message.fadeOut();
    }

    clearTimeout(window.confirmationMessageTimeoutId);
    var message = $('.confirmation-message, .confirmation-message-failure');

    if (!message.length) {
        message = $('<div class="' + messageClass + '">' +
                        '<span class="body"></span>' +
                        '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '</div>');
        message.find('.close').on('click', closeConfirmation);
        $('body').append(message);
    }
    message.removeClass().addClass(messageClass);
    text = text || "@tr.Confirmed";
    message.find('.body').text(text);
    message.fadeIn();
    window.confirmationMessageTimeoutId = setTimeout(closeConfirmation, 3000);
}
