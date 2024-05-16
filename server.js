const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve HTML files from the "template" directory
app.use(express.static(path.join(__dirname, 'template')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'login.html'));
});

app.get('/video', (req, res) => {
  res.sendFile(path.join(__dirname, 'template', 'video.html'));
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join room', (room) => {
    if (!rooms[room]) {
      rooms[room] = [];
    }

    if (rooms[room].length >= 2) {
      socket.emit('room full');
      socket.disconnect();
      return;
    }

    rooms[room].push(socket.id);
    socket.join(room);

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    });

    socket.on('offer', (data) => {
      socket.to(room).emit('offer', data);  // Relay the offer along with the name
    });

    socket.on('answer', (data) => {
      socket.to(room).emit('answer', data);  // Relay the answer along with the name
    });

    socket.on('candidate', (candidate) => {
      socket.to(room).emit('candidate', candidate);  // Relay ICE candidates normally
    });

    socket.on('chat message', (msg) => {
      socket.to(room).emit('chat message', msg);  // Broadcast chat message to the room
    });
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
