var express = require("express");
var app = express();

app.listen(8888, () => {
    console.log("서버 시작됨");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
