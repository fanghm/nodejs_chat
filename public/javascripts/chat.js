var Chat = function(socket) {
	this.socket = socket;
};

Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	};

	this.socket.emit('message', message);
};

Chat.prototype.processCommand = function(command) {
	var words = command.split(' ');
	var command = words[0].substring(1).toLowerCase();

	var message = false;
	switch(command) {
		case 'join':
    		words.shift();
    		var room = words.join(' ');
    		this.socket.emit('join', room);
    		break;

		case 'nick':
    		words.shift();
    		var name = words.join(' ');
    		this.socket.emit('nameAttempt', name);
    		break;

		default:
    		message = 'Unrecognized command: ' + command;
    		break;
	}

	return message;
};
