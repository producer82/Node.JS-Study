const fs = require("fs");

//readFileSync
// console.log('A');
// var result = fs.readFileSync('E:/인생/개발/Node.JS-Study/WebApp/examples/sample.txt', 'utf8');
// console.log(result);
// console.log('C');

//readFile
console.log('A');
fs.readFile('E:/인생/개발/Node.JS-Study/WebApp/examples/sample.txt', 'utf8', (err, data) => {
    console.log(data);
});
console.log('C');