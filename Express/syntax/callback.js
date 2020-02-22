/*
function a(){
    console.log('A');
}
*/

var a = function(){
    console.log('A');
}

function slowFunc(callback){
    callback();
    console.log('B');
}

slowFunc(a);