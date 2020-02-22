const express = require("express");
const app = express();
const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const template = require("./lib/template.js");

app.get('/', (req, res) => {
	fs.readdir('./data', (err, filelist) => {
		var title = 'Welcome';
		var desc = 'Hello Node.JS';
		var list = template.list(filelist);
		var html = template.html(title, list, 
			`<h2>${title}</h2>${desc}`, 
			`<a href="/create">글쓰기</a>`);
		res.send(html);
	});
});

app.get('/page/:pageId', (req, res) => {
	var filteredId = path.parse(req.params.pageId).base;
	fs.readFile(`./data/${filteredId}`, 'utf8', (err, desc) => {
		fs.readdir('./data', (err, filelist) => {
			var title = req.params.pageId;
			var list = template.list(filelist);
			var html = template.html(title, list, 
				`<h2>${title}</h2>${desc}`, 
				`<a href="/create">글쓰기</a>
				<a href="/update/${req.params.pageId}">수정</a>
				<form action="/delete" method="post">
					<input type="hidden" name="id" value="${title}">
					<input type="submit" value="삭제">
				</form>`
			);
			res.send(html);
		});
	});
});

app.get('/create', (req, res) => {
	fs.readdir('./data', (err, filelist) => {
		var title = 'WEB - create';
		var list = template.list(filelist);
		var html = template.html(title, list, `
			<form action="/create" method="POST">
				<p><input type="text" name="title" placeholder="제목"></p>
				<p>
					<textarea name="desc" placeholder="본문"></textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			</form>
			`, ``);
		res.send(html);
	});
});

app.post('/create', (req, res) => {
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
});

app.get('/update/:updateId', (req, res) => {
	var filteredId = path.parse(req.params.updateId).base;
	fs.readFile(`./data/${filteredId}`, 'utf8', (err, desc) => {
		fs.readdir('./data', (err, filelist) => {
			var title = req.params.updateId
			var list = template.list(filelist)
			var html = template.html(title, list, 
				`<form action="/update" method="POST">
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
			res.end(html);
		});
	});
});

app.post('/update', (req, res) => {
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
				res.redirect(`/page/${title}`)				
			});
		});
	});
});

app.post('/delete', (req, res) => {
	var body = '';
	req.on('data', (data) => {
		body += data;		
	});
	req.on('end', () => {
		var post = qs.parse(body);
		var id = post.id;
		var filteredId = path.parse(post.id).base;
		fs.unlink(`./data/${filteredId}`, (err) => {
			if (err) throw err;
			res.redirect('/');
		});
	});
});

app.listen(8888, () => {
	console.log("Server listening on port 8888");
});

// //fs.readdir, fs.readFile, url.parse, template ${}, etc...
// const http = require("http");
// const fs = require("fs");
// const url = require("url");
// 
// const template = require("./lib/template.js");
// const path = require("path");

// http.createServer((req, res) => {
// 	var _url = req.url;
// 	var queryData = url.parse(_url, true).query;
// 	var pathname = url.parse(_url, true).pathname;

// 	console.log(pathname);
// 	if(pathname == '/'){
// 		if(queryData.id === undefined){
// 		
// 		}
// 		else {
// 			
// 		}
// 	}
// 	else if(pathname == '/create'){
// 		
// 	}
// 	else if(pathname === '/create_process'){

// 	}
// 	else if(pathname === `/update`){

// 	}
// 	else if(pathname === '/update_process'){

// 	}
// 	else if(pathname === '/delete_process'){

// 	}
// 	else{
// 		res.writeHead(404);
// 		res.end('Not Found');
// 	}
// }).listen(8888)