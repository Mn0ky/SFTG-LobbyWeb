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
var lobbies;

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
    console.log("req body: " + req.body);
    console.log("new num: " + newCount.num);
    lobbyCount[0] = newCount.num;
    io.emit('LobbyCountUpdate', newCount.num);
    console.log("send new lobby num");
    res.send(newCount);
});

app.post('/api/lobbylist', (req, res) => {
    const newLobbyList = {
        Lobbies: req.body.Lobbies
    };

    console.log("new name 0: " + newLobbyList.Lobbies[0].names[0]);
    console.log("version: " + newLobbyList.Lobbies[0].ver);
    console.log("lobbyid: " + newLobbyList.Lobbies[0].lobbyid);
    console.log("joinlink: " + newLobbyList.Lobbies[0].joinlink);

    /* console.log("new name 1, 0: " + newLobbyList.Lobbies[1].names[0]);
    console.log("version: " + newLobbyList.Lobbies[1].ver);
    console.log("lobbyid: " + newLobbyList.Lobbies[1].lobbyid);
    console.log("joinlink: " + newLobbyList.Lobbies[1].joinlink); */

    lobbies = newLobbyList;
    io.emit('LobbyListUpdate', newLobbyList);
    console.log("sent new lobby!");
    res.send(newLobbyList);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  UpdateSFPlayerCount();
  io.emit('LobbyListUpdate', lobbies);
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