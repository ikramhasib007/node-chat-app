var socket = io();

function scrollToBottom () {
    var messages = jQuery("#messages");
    var newMessage = messages.children('li:last-child');
    // height
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    //console.log('clientHeight',clientHeight,'scrollTop',scrollTop,'scrollHeight', scrollHeight,'newMessageHeight', newMessageHeight,'lastMessageHeight',lastMessageHeight);
    //console.log('total', clientHeight + scrollTop + newMessageHeight + lastMessageHeight);
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = "/";
        } else {
            console.log('no error');
        }
    });
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
    scrollToBottom();
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
    scrollToBottom();
});

jQuery('#form').submit(function(e){
    e.preventDefault();
    var messageTextbox = jQuery('input[name="message"]');
    if(messageTextbox.val()) {
        socket.emit('createMessage', {
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

socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery("#users").html(ol);
})

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
