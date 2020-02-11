const fs = require("fs");

fs.readdir('./Node.JS/WebApp/data', (err, list) => {
    console.log(list);
});