var socket = io();
socket.on('connect', function () {
    console.log('Connect to server');

});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime 
    });

    jQuery("#messages").append(html);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
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
