var http = require("http");

const PORT = process.env.PORT || 3000;
http.listen(PORT, function () {
    console.log("listening on localhost:3000");
});

// Console will print the message
console.log('Server running!!');