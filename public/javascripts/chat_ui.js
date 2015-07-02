function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').addClass('sysmsg').html(message);
}

function processUserInput(chatApp, socket) {
	var message = $('#send-message').val();
    if (message.length === 0 || !message.trim())    // blank or white-space only
        return;
    
    if (message.charAt(0) == '/') {
        var sysMessage = chatApp.processCommand(message);
        if (sysMessage) {
            $('#messages').append(divSystemContentElement(sysMessage));
        }
    } else {
    	chatApp.sendMessage($('#room').text(), message);
    	$('#messages').append(divEscapedContentElement('Me: ' + message));

        // scroll to to bottom, strange only the 2nd way work
        // refer: http://stackoverflow.com/questions/10503606/scroll-to-bottom-of-div-on-page-load-jquery
    	// $('#messages').scrollTop( $('#messages').prop('ScrollHeight') );
        $('#messages').scrollTop( $('#messages')[0].scrollHeight);
    }

	$('#send-message').val('');
}

var socket = io.connect();
$(document).ready(function() {
	var chatApp = new Chat(socket);

    setInterval(function() {
        socket.emit('refreshRooms');
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
        $('#messages').scrollTop( $('#messages')[0].scrollHeight);  // scroll messsages to bottom by the way

		$('#room-list').empty();

		for (var room in rooms) {
			room = room.substring(1, room.length); // room starts with '/'
			if (room != '') {
				$('#room-list').append(divEscapedContentElement(room));
			}
		}

		$('#room-list div').click(function() {
            if ($('#room').text() === $(this).text()) {
                //$('#messages').append($('<div></div>').text('You are already in this room'));
            } else {
			    chatApp.processCommand('/join ' + $(this).text());
            }

			$('#send-message').focus();
		});
	});

	$('#send-message').focus();

	$('#send-form').submit(function() {
		processUserInput(chatApp, socket);
		return false;
	});
	
});


