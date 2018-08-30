var socket = io();
socket.on('connect', function () {
    console.log('Connect to server');

});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
});

socket.on('disconnect', function() {
    console.log('Disconnect from server');
});
