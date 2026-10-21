// const express = require('express');
// const app=express()
// const { Server } = require("socket.io");
// const { createServer } = require('http');
// const server = createServer(app);
// const io = new Server(server);

// app.set("view engine","ejs")

// app.use(express.static(__dirname + '/public'));
// app.get('/',(req,res)=>res.render("index"))
// server.listen(3000,()=>{
// console.log("Running port 3000");})
// // io.on('connection', (socket) => {
// //     console.log('a user connected');});


// // io.on('connection', (socket) => {
// //     socket.on('chat message', (msg) => {
// //       console.log('message: ' + msg);
// //     });
// //   });
// //   io.on('connection', (socket) => {
// //     socket.on('chat message', (msg) => {
// //       io.emit('chat message', msg);
// //     });
// //   });
// let users={

// }
// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on('join', (username) => {
//       users[socket.id] = username;
//       socket.broadcast.emit('user connected', username);
//       io.emit('update users', Object.values(users));
//   });

//   socket.on('chat message', (msg) => {
//       const messageData = {
//           username: users[socket.id],
//           message: msg
//       };
//       io.emit('chat message', messageData);
//   });

//   socket.on('disconnect', () => {
//       const username = users[socket.id];
//       delete users[socket.id];
//       io.emit('user disconnected', username);
//       io.emit('update users', Object.values(users));
//       console.log('user disconnected');
//   });
// });


require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const connectDB = require("./congfig/db");
const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");
connectDB();

const app = express();
app.use(express.json());
app.use(express.static("client"));
app.use("/uploads", express.static("server/uploads"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(authRoutes); 
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/chat", (req, res) => {
    res.render("chat");
});
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});
const multer = require("multer");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_");
        cb(null, Date.now() + "-" + safeName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 👇 THIS MUST EXIST
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
        file: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
         size: req.file.size
    });
});
let onlineUsers = {};

io.on("connection", (socket) => {

    socket.on("join", async ({ username, room }) => {
        socket.join(room);
        onlineUsers[socket.id] = { username, room };

        const messages = await Message.find({ room }).sort({ createdAt: 1 });
        socket.emit("chat history", messages);

        io.to(room).emit("user connected", username);
    });
socket.on("chat message", async (data) => {
     console.log("Received message data:", data); // Debugging line
    const message = await Message.create({
        sender: data.username,   // 👈 ADD THIS
        room: data.room,
        message: data.message,
        file: data.file
    });

    io.to(data.room).emit("chat message", message);
});

    socket.on("disconnect", () => {
        const user = onlineUsers[socket.id];
        if (user) {
            io.to(user.room).emit("user disconnected", user.username);
        }
        delete onlineUsers[socket.id];
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});