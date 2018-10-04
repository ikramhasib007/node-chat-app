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
    var a = jQuery('<a target="_blank">My current location<a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery("#messages").append(li);
    console.log('newLocationMessage', message);
});

jQuery('#form').submit(function(e){
    e.preventDefault();
    var messageTextbox = jQuery('input[name="message"]');
    if(messageTextbox.val()) {
        socket.emit('createMessage', {
            from: 'User',
            text: messageTextbox.val()
        }, function(){
            messageTextbox.val('');
        });
    } else {
        messageTextbox.focus()
    }
});

socket.on('disconnect', function() {
    console.log('Disconnect from server');
});

var locationButton = jQuery("#send-location");
locationButton.on("click", function(){
    if(!navigator.geolocation) {
        return alert('Geolocation not supported on your browser.');
    }
    locationButton.attr('disabled', 'disabled').text("Sending location...");

    navigator.geolocation.getCurrentPosition(function(position){
        
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function() {
            locationButton.removeAttr('disabled').text('Send location');
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        return alert('Unable to fetch geo location');
    });
});
