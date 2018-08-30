var socket = io();
socket.on('connect', function () {
    console.log('Connect to server');

    socket.emit('createEmail', {
        to: 'jolen123@gmail.com',
        text: 'hey !'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnect from server');
});

socket.on('newEmail', function(email) {
    console.log('newEmail', email);
});