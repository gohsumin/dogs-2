import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

http.createServer(function (req, res) {
	switch (path.extname(req.url)) {
		case '.css': {
			res.writeHead(200, { 'Content-type': 'text/css' });
			fs.readFile(__dirname + req.url, 'utf8', function (err, css) {
				if (err) throw err;
				res.end(css);
			});
			return;
		};
		case '.js': {
			res.writeHead(200, { 'Content-type': 'text/javascript' });
			fs.readFile(__dirname + req.url, 'utf8', function (err, js) {
				if (err) throw err;
				res.end(js);
			});
			return;
		};
		case '.svg': {
			res.writeHead(200, { 'Content-type': 'image/svg+xml' });
			fs.readFile(__dirname + req.url, 'utf8', function (err, svg) {
				if (err) throw err;
				res.end(svg);
			});
			return;
		}
		default:
			break;
	}
	switch (req.url) {
		case '/': {
			res.writeHead(200, { 'Content-type': 'text/html' });
			fs.readFile(__dirname + '/src/index.html', function (err, html) {
				if (err) throw err;
				res.end(html);
			});
			break;
		};
		case '/dogs': {
			res.writeHead(200, { 'Content-type': 'text/html' });
			fs.readFile(__dirname + '/src/dogs/index.html', function (err, html) {
				if (err) throw err;
				res.end(html);
			});
			break;
		};
		default:
			res.end();
			break;
	}
}).listen(3000);