const express = require('express');
const app=express()
const { Server } = require("socket.io");
const { createServer } = require('http');
const server = createServer(app);
const io = new Server(server);

app.set("view engine","ejs")

app.use(express.static(__dirname + '/public'));
server.listen(3000,()=>{
console.log("Running port 5000");})
// io.on('connection', (socket) => {
//     console.log('a user connected');});


// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });
//   });
//   io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//       io.emit('chat message', msg);
//     });
//   });
let users={

}
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (username) => {
      users[socket.id] = username;
      socket.broadcast.emit('user connected', username);
      io.emit('update users', Object.values(users));
  });

  socket.on('chat message', (msg) => {
      const messageData = {
          username: users[socket.id],
          message: msg
      };
      io.emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
      const username = users[socket.id];
      delete users[socket.id];
      io.emit('user disconnected', username);
      io.emit('update users', Object.values(users));
      console.log('user disconnected');
  });
});


app.get('/',(req,res)=>res.render("index"))
