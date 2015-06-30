function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
	var message = $('#send-message').val();
    var sysMessage;
    
    if (message.charAt(0) == '/') {
        sysMessage = chatApp.processCommand(message);
        if (sysMessage) {
            $('#messages').append(divSystemContentElement(sysMessage));
        }
    } else {
    	chatApp.sendMessage($('#room').text(), message);
    	$('#messages').append(divEscapedContentElement(message));
    	$('#messages').scrollTop($('#messages').prop('ScrollHeight'));
    }

	$('#send-message').val('');
}

var socket = io.connect();
$(document).ready(function() {
	var chatApp = new Chat(socket);

    setInterval(function() {
        socket.emit('refreshRooms'); //, io.sockets.manager.rooms
    }, 1000);

	socket.on('nameResult', function(result) {
		var message;
		if(result.success) {
			message = 'You are now known as ' + result.name + '.';
		} else {
			message = result.message;
		}

		$('#messages').append(divSystemContentElement(message));
	});

	socket.on('joinResult', function(result) {
		$('#room').text(result.room);
		$('#messages').append(divSystemContentElement('Room changed to ' + result.room));
	});

	socket.on('message', function(message) {
		var newElement = $('<div></div>').text(message.text);
		$('#messages').append(newElement);
	});

	socket.on('rooms', function(rooms) {
		$('#room-list').empty();
        socket.emit('message', {text: 'on rooms'});

		for (var room in rooms) {
			//room = room.substring(1, room.length); //???
			//if (room != '') {
				$('room-list').append(divEscapedContentElement(room));
			//}
		}

		$('#room-list div').click(function() {
			chatApp.processCommand('/join ' + $(this).text());
			$('#send-message').focus();
		});
	});

	$('#send-message').focus();

	$('#send-form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
	
});


