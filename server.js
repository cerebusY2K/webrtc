const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Relay candidate messages
  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  // Relay offers
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  // Relay answers
  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
