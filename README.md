# About
A chat program based on [Node.js](https://nodejs.org/) and WebSocket - [Socket.IO](http://socket.io/).

# Install & deploy
* Download source code to a folder on your machine, either Windows, Linux or Mac.
* Make sure Node.js is installed on your machine and run below commands from console:
<pre><code>
    npm i
    node server.js
</code></pre>
then you should be able to access it at: http://localhost:3000/

# Message definitions
---
## Client -> Server
* refreshRooms - update room list
* join <room> - change room
* nameAttempt <name> - change nickname
* message {room, text} - send message

## Server -> Client
* rooms <rooms> - refresh room list, and scroll messages area to bottom btw
* joinResult {room} - return room change result
* nameResult {success, [name|message]} - return nickname change result
* message {text} - broadcast user or system message to specified room

# TODO
---
* highlight current room in room list and make it not clickable
* list all users in current room and can click to talk privately, with my name on top of list and not clickable 
* refine page layout
* store/query history messages
* share via email and more ways
* present chat messages clearly
    + highlight speaker's name
    + display differently for user messages and system messages, make system messages less distracting
    + display self messages on right side and others' message on left side
