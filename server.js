const io = require('socket.io')(3003);

io.on('connection', (socket) => {
  console.log('Client connected!');

  socket.on('disconnect', () => {
    console.log('Client disconnected!');
  });
});
