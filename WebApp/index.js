//fs.readdir, fs.readFile, url.parse, template ${}, etc...
const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

function templateHTML(title, list, body, control){
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
				${control}
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
			fs.readdir('./data', (err, filelist) => {
				var title = 'Welcome';
				var desc = 'Hello Node.JS'
				var list = templateList(filelist)
				var template = templateHTML(title, list, 
					`<h2>${title}</h2>${desc}`, 
					`<a href="/create">글쓰기</a>`
					);
				res.writeHead(200);
				res.end(template);
			});
		}
		else {
			fs.readFile(`./data/${queryData.id}`, 'utf8', (err, desc) => {
				fs.readdir('./data', (err, filelist) => {
					var title = queryData.id
					var list = templateList(filelist)
					var template = templateHTML(title, list, 
						`<h2>${title}</h2>${desc}`, 
						`<a href="/create">글쓰기</a>
						<a href="/update?id=${title}">수정</a>`
					);
					res.writeHead(200);
					res.end(template);
				});
			});
		}
	}
	else if(pathname == '/create'){
		fs.readdir('./data', (err, filelist) => {
			var title = 'WEB - create';
			var list = templateList(filelist)
			var template = templateHTML(title, list, `
				<form action="/create_process" method="POST">
					<p><input type="text" name="title" placeholder="제목"></p>
					<p>
						<textarea name="desc" placeholder="본문"></textarea>
					</p>
					<p>
						<input type="submit">
					</p>
				</form>
			`, ``);
			res.writeHead(200);
			res.end(template);
		});
	}
	else if(pathname === '/create_process'){
		var body = '';
		req.on('data', (data) => {
			body += data;
		});
		req.on('end', () => {
			var post = qs.parse(body);
			var title = post.title;
			var desc = post.desc;

			fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {
				res.writeHead(302, {Location: `/?id=${title}`});
				res.end();

				if (err) throw error;
			});
			console.log(post);
		})
	}
	else if(pathname === `/update`){
		fs.readFile(`./data/${queryData.id}`, 'utf8', (err, desc) => {
			fs.readdir('./data', (err, filelist) => {
				var title = queryData.id
				var list = templateList(filelist)
				var template = templateHTML(title, list, 
					`<form action="/update_process" method="POST">
						<input type="hidden" name="id" value="${title}">
						<p><input type="text" name="title" placeholder="제목" value="${title}"></p>
						<p>
							<textarea name="desc" placeholder="본문">${desc}</textarea>
						</p>
						<p>
							<input type="submit">
						</p>
					</form>`, 
					`<a href="/create">글쓰기</a>`
				);
				res.writeHead(200);
				res.end(template);
			});
		});
	}
	else if(pathname === '/update_process'){
		var body = '';
		req.on('data', (data) => {
			body += data;
		});
		req.on('end', () => {
			var post = qs.parse(body);
			var id = post.id;
			var title = post.title;
			var desc = post.desc;

			fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
				fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {
					res.writeHead(302, {Location: `/?id=${title}`});
					res.end();
				});
			});
		})
	}
	else{
		res.writeHead(404);
		res.end('Not Found');
	}
}).listen(8888)