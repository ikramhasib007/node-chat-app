const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'John',
        text: 'Hi there! How are you?',
        createdAt: 123
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    })

    socket.on('disconnect', () => {
        console.log('User was Disconnect');
    });
});

server.listen(port, () => {
    console.log(`server started at port ${port}`);
});