const e = require('express');
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var playerCount;
var lobbyCount = [];

app.use(express.json());


app.get('/', (req, res) => {
    console.log("normal website");
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/lobbycount', (req, res) => {
    const newCount = {
        id: lobbyCount.length + 1,
        num: req.body.num
    };
    console.log("new num: " + newCount.num);
    lobbyCount[0] = newCount.num;
    io.emit('LobbyCountUpdate', newCount.num);
    console.log("send new lobby num");
    res.send(newCount);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

function UpdateSFPlayerCount() {
    var data;
    const req = https.request("https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=674940", res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', d => {
            data = JSON.parse(d);
            console.log("player count: " + data["response"]["player_count"]);
            playerCount = data["response"]["player_count"]; 
        })
        
    })

    req.on('error', error => {
        console.error(error);
    })

    req.end();
    io.emit('PlayerCountUpdate', playerCount);
}

setInterval(UpdateSFPlayerCount, 7500); // Time in milliseconds

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});