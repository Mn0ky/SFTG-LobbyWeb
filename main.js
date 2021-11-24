const express = require('express');
const app = require("express")();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get("/", function (req, res) {
    res.sendfile("index.html");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("listening on localhost:3000");
});

io.on("connection",
    function(socket) {
        console.log("A user connected NOW", socket.id);
    });


// Console will print the message
console.log('Server running!!');
// console.log(app.use(express.static(__dirname + '/public')));