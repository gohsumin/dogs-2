import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const navString = `
	<link rel='stylesheet' href='../css/nav.css'>
	<nav style='height: 80px;'>
		<ul class='nav-links'>
			<li<%= (url && (url === '/')) ? ' class=current' : '' %>><a href='/' >Home</a></li>
			<li<%= (url && (url === '/dogs')) ? ' class=current' : '' %>><a href='/dogs' >All Dog Breeds</a></li>
		</ul>
		<div class='search'>
			<input type='text'>
		</div>
	</nav>
`;

http.createServer(function (req, res) {
	switch (path.extname(req.url)) {
		case '.css': {
			res.writeHead(200, { 'Content-type': 'text/css' });
			fs.readFile(__dirname + '/src' + req.url, 'utf8', function (err, css) {
				if (err) throw err;
				res.end(css);
			});
			return;
		};
		case '.js': {
			res.writeHead(200, { 'Content-type': 'text/javascript' });
			fs.readFile(__dirname + '/src' + req.url, 'utf8', function (err, js) {
				if (err) throw err;
				res.end(js);
			});
			return;
		};
		case '.svg': {
			res.writeHead(200, { 'Content-type': 'image/svg+xml' });
			fs.readFile(__dirname + '/src' + req.url, 'utf8', function (err, svg) {
				if (err) throw err;
				res.end(svg);
			});
			return;
		}
		default:
			break;
	}

	if (req.url === '/') {
		res.writeHead(200, { 'Content-type': 'text/html' });
		fs.readFile(__dirname + '/src/ejs/home.ejs', 'utf8', function (err, html) {
			if (err) throw err;
			const nav = ejs.render(navString, {url: req.url});
			const finalHTML = ejs.render(html, { nav: nav });
			res.end(finalHTML);
		});
	} else if (req.url === '/dogs') {
		res.writeHead(200, { 'Content-type': 'text/html' });
		fs.readFile(__dirname + '/src/ejs/all-dogs.ejs', 'utf8', function (err, html) {
			if (err) throw err;
			const nav = ejs.render(navString, {url: req.url});
			const finalHTML = ejs.render(html, { nav: nav });
			res.end(finalHTML);
		});
	} else if (req.url.match(/\/dogs\/[a-zA-Z ]+/)) {
		res.writeHead(200, { 'Content-type': 'text/html' });
		fs.readFile(__dirname + '/src/ejs/dog.ejs', 'utf8', function (err, html) {
			if (err) throw err;
			const nav = ejs.render(navString, {url: null});
			const finalHTML = ejs.render(html, { nav: nav });
			res.end(finalHTML);
		});
	} else {
		res.end();
	}
}).listen(3000);