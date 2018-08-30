var socket = io();
socket.on('connect', function () {
    console.log('Connect to server');

});

socket.on('newMessage', function(message) {
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery("#messages").append(li);
    console.log('newMessage', message);
});

jQuery('#form').submit(function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('input[name="message"]').val()
    });
});

socket.on('disconnect', function() {
    console.log('Disconnect from server');
});
