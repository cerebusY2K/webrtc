const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
var path = require('path')


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

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);  // Relay the offer along with the name
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);  // Relay the answer along with the name
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);  // Relay ICE candidates normally
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
