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

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location<a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery("#messages").append(li);
    console.log('newLocationMessage', message);
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

var locationButton = jQuery("#send-location");
locationButton.on("click", function(){
    if(!navigator.geolocation) {
        return alert('Geolocation not supported on your browser.');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        console.log('position', position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        return alert('Unable to fetch geo location');
    });
});
