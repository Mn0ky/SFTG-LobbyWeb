let app = require("express")();
let http = require("http").Server(app);


app.get("/", function (req, res) {
    res.sendfile("index.html");
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
    console.log("listening on localhost:3000");
});

// Console will print the message
console.log('Server running!!');
// console.log(app.use(express.static(__dirname + '/public')));