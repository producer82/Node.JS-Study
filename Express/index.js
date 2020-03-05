const express = require("express");
const app = express();
const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const template = require("./lib/template.js");
const bodyParser = require("body-parser");
const compression = require("compression");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use((req, res, next) => {
	fs.readdir('./data', (err, filelist) => {
		req.list = filelist;
		next();
	});
});

app.get('/', (req, res) => {
	var title = 'Welcome';
	var desc = 'Hello Node.JS';
	var list = template.list(req.list);
	var html = template.html(title, list, 
		`<h2>${title}</h2>${desc}`, 
		`<a href="/create">글쓰기</a>`);
	res.send(html);
});

app.get('/page/:pageId', (req, res) => {
	var filteredId = path.parse(req.params.pageId).base;
	fs.readFile(`./data/${filteredId}`, 'utf8', (err, desc) => {
		var title = req.params.pageId;
		var list = template.list(req.list);
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

app.get('/create', (req, res) => {
	var title = 'WEB - create';
	var list = template.list(req.list);
	var html = template.html(title, list, `
		<form action="/create" method="POST">
			<p><input type="text" name="title" placeholder="제목"></p>
			<p>
				<textarea name="desc" placeholder="본문"></textarea>				</p>
			<p>
				<input type="submit">
			</p>
		</form>
	`, ``);
	res.send(html);
});

app.post('/create', (req, res) => {
	var post = req.body;
	var title = post.title;
	var desc = post.desc;

	fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {
		res.writeHead(302, {Location: `/?id=${title}`});
		res.end();

		if (err) throw error;
	});
	console.log(post);
});

app.get('/update/:updateId', (req, res) => {
	var filteredId = path.parse(req.params.updateId).base;
	fs.readFile(`./data/${filteredId}`, 'utf8', (err, desc) => {
		var title = req.params.updateId
		var list = template.list(req.list)
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

app.post('/update', (req, res) => {
	var post = req.body;
	var id = post.id;
	var title = post.title;
	var desc = post.desc;

	fs.rename(`./data/${id}`, `./data/${title}`, (err) => {
		fs.writeFile(`./data/${title}`, desc, 'utf8', (err) => {
			res.redirect(`/page/${title}`)				
		});
	});
});

app.post('/delete', (req, res) => {
	var post = req.body;
	var id = post.id;
	var filteredId = path.parse(post.id).base;
	fs.unlink(`./data/${filteredId}`, (err) => {
		if (err) throw err;
		res.redirect('/');
	});
});

app.use((req, res, next) => {
	res.status(404).send('아무것도 없는데 뭐하러 왔노?');
});

app.listen(8888, () => {
	console.log("Server listening on port 8888");
});