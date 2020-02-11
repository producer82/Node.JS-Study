//fs.readdir, fs.readFile, url.parse, template ${}, etc...
const http = require("http");
const fs = require("fs");
const url = require("url");

function templateHTML(title, list, body){
	return `
		<!doctype html>
		<html>
			<head>
				<title>WEB1 - ${title}</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h1><a href="/">WEB2</a></h1>
				${list}
				<a href="/create">글쓰기</a>
				<h2>${title}</h2>
				${body}
			</body>
		</html>
	`;
}

function templateList(filelist){
	var list = '<ul>';
	for(var i = 0; i < filelist.length; i++){
		list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
	}
	list += '</ul>';
	
	return list;
}

http.createServer((req, res) => {
	var _url = req.url;
	var queryData = url.parse(_url, true).query;
	var pathname = url.parse(_url, true).pathname;

	console.log(pathname);
	if(pathname == '/'){
		if(queryData.id === undefined){
			fs.readdir('E:/인생/개발/Node.JS-Study/WebApp/data', (err, filelist) => {
				var title = 'Welcome';
				var desc = 'Hello Node.JS'
				var list = templateList(filelist)
				var template = templateHTML(title, list, desc);
				res.writeHead(200);
				res.end(template);
			});
		}
		else {
			fs.readFile(`E:/인생/개발/Node.JS-Study/WebApp/data/${queryData.id}`, 'utf8', (err, desc) => {
				fs.readdir('E:/인생/개발/Node.JS-Study/WebApp/data', (err, filelist) => {
					var title = queryData.id
					var template = templateHTML(title, templateList(filelist), desc);
					res.writeHead(200);
					res.end(template);
				});
			});
		}
	}
	else if(pathname == '/create'){
		fs.readdir('E:/인생/개발/Node.JS-Study/WebApp/data', (err, filelist) => {
			var title = 'WEB - create';
			var list = templateList(filelist)
			var template = templateHTML(title, list, `
				<form action="http://localhost:8888/process_create" method="POST">
					<p><input type="text" name="title" placeholder="제목"></p>
					<p>
						<textarea name="desc" placeholder="본문"></textarea>
					</p>
					<p>
						<input type="submit">
					</p>
				</form>
			`);
			res.writeHead(200);
			res.end(template);
		});
	}
	else{
		res.writeHead(404);
		res.end('Not Found');
	}
}).listen(8888);
