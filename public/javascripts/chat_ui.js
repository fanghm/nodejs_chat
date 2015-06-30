function processUserInput(chatApp, socket) {
	var message = $('#send-message').var;

	//todo...
	chatApp.sendMessage($('#room').text(), message);
	$('#messages').append(divEscapedContentElement(message));
	$('#messages').scrollTop($('#messages').prop('ScrollHeight'));

	$('#send-message').var('');
}

var socket = io.connect();
$(document).ready(function() {
	var chatApp = new Chat(socket);

	socket.on('nameResult', function(result) {
		var message;
		if(result.success) {
			message = 'You are now known as ' + result.name + '.';
		} else {
			message = result.message;
		}

		$('#messages').append(message);
	});

	socket.on('joinResult', function(result) {
		$('#room').text(result.room);
		$('#messages').append('Room changed');
	});

	socket.on('message', function(message) {
		var newElement = $('<div></div>').text(message.text);
		$('#messages').append('newElement');
	});

	socket.on('rooms', function(rooms) {
		$('#room-list').empty();

		for (var room in rooms) {
			room = room.substring(1, room.length);
			if (romm != '') {
				$('room-list').append(romm);
			}
		}

		$('#room-list div').click(function() {
			chatApp.processCommand('/join ' + $(this).text());
			$('#send-message').focus();
		});
	});

	setInterval(function() {
		socket.emit('rooms');
	}, 1000);

	$('#send-message').focus();

	$('#send-form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
	
});


