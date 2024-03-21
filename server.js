const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send a rotation event along with server time every 300 milliseconds
    const rotationInterval = setInterval(() => {
        const serverTime = new Date().toISOString().slice(11, -1); // Get server time (HH:MM:SS.ms)
        socket.emit('rotate_dial', serverTime);
    }, 300);

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        clearInterval(rotationInterval); // Stop the rotation interval when the user disconnects
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});