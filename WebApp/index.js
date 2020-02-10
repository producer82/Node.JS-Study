const http = require("http");
const fs = require("fs");
const url = require("url");

http.createServer((req, res) => {
	var _url = req.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;
	var list;

	if(pathname == '/'){
		if(queryData.id === undefined){
			fs.readdir('./Node.JS/WebApp/data', (err, filelist) => {
				var title = 'Welcome';
				var desc = 'Hello Node.JS';
				var _list = '<ul>';

				var list = '<ul>';
				for(var i = 0; i < filelist.length; i++){
					list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
				}
				list += '</ul>';
				
				/*<ol>
				<li><a href="/?id=HTML">HTML</a></li>
				<li><a href="/?id=CSS">CSS</a></li>
				<li><a href="/?id=JavaScript">JavaScript</a></li>
				</ol>*/
				var template = `
				<!doctype html>
				<html>
					<head>
						<title>WEB1 - ${title}</title>
						<meta charset="utf-8">
					</head>
					<body>
						<h1><a href="/">WEB</a></h1>
						${list}
						<h2>${title}</h2>
						<p>
						${desc}
						</p>
					</body>
				</html>
				`;
				res.writeHead(200);
				res.end(template);
			});
		}
		else {
			fs.readFile(`./Node.JS/WebApp/data/${queryData.id}`, 'utf8', (err, desc) => {
				fs.readdir('./Node.JS/WebApp/data', (err, filelist) => {
					var title = queryData.id
					var list = '<ul>';
					for(var i = 0; i < filelist.length; i++){
						list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
					}
					list += '</ul>';

					var template = `
					<!doctype html>
					<html>
						<head>
							<title>WEB1 - ${title}</title>
							<meta charset="utf-8">
						</head>
						<body>
							<h1><a href="/">WEB</a></h1>
							${list}
							<h2>${title}</h2>
							<p>
							${desc}
							</p>
						</body>
					</html>
					`;
					res.writeHead(200);
					res.end(template);
				});
			});
		}
	}
	else{
		res.writeHead(404);
		res.end('Not Found');
	}
}).listen(8888);
