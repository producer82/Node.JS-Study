/*Function Argument*/
function say(word){
	console.log(word);
}

function execute(someFunction, value){
	someFunction(value);
}

execute(say, "Hello");

/*Anonymous Function*/
function execute2(someFunction, value){
	
}

execute2(function(word){ console.log(word) }, "Hello");