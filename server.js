/*
URL 구조

                               url.parse(string).query
                                           |
           url.parse(string).pathname      |
                       |                   |
                       |                   |
                     ------ -------------------
http://localhost:8888/start?foo=bar&hello=world
                                ---       -----
                                 |          |
                                 |          |
              querystring(string)["foo"]    |
                                            |
						 querystring(string)["hello"]
						 
*/

//require를 통하여 필요한 모듈을 변수에 쑤셔박을 수 있다.
var http = require("http");
var url = require("url");

function start(route, handle){
	//http.createServer를 위한 콜백 함수
	function onRequest(req, res){
		//pathname을 가져와서 라우터로 넘김
		var pathname = url.parse(req.url).pathname;
		console.log("Request for " + pathname + " received.");
		route(handle, pathname, res);
	}

	//http.createServer(콜백 함수) -> 서버 객체를 리턴함
	//서버객체.listen(8888) -> 서버 객체는 .listen() 메소드로 포트 지정 가능
	http.createServer(onRequest).listen(8888);

	console.log("Server has started.");
}

//start 함수를 모듈화 함
//exports.모듈이름 = 함수이름;
exports.start = start;