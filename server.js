import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { fileURLToPath } from 'url';

const { PORT=process.env.PORT||3000, LOCAL_ADDRESS='0.0.0.0' } = process.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileTypes = {
	css: 'text/css',
	js: 'text/javascript',
	ejs: 'text/javascript',
	svg: 'image/svg+xml',
	ico: "image/x-icon",
};

http.createServer(function (req, res) {
	if (path.extname(req.url)) {
		const ext = path.extname(req.url).slice(1);
		const contentType = fileTypes[ext];
		if (!contentType) {
			console.log(`unsupported: ${ext}`);
			return;
		}
		res.writeHead(200, { 'Content-type': contentType });
		fs.readFile(__dirname + '/src' + req.url, 'utf8', function (err, data) {
			if (err) throw err;
			res.end(data);
		});
		return;
	}
	
	const filePath = (req.url === '/') ?
	'/src/ejs/home.ejs' :
	(req.url === '/dogs') ?
	'/src/ejs/all-dogs.ejs' :
	req.url.match(/\/dogs\/[a-zA-Z ]+/) ?
	'/src/ejs/dog.ejs' :
	'/src/ejs/404.ejs';

	ejs.renderFile(__dirname + filePath, {url: req.url}, function (err, html) {
		if (err) throw err;
		res.end(html);
	});
}).listen(PORT, LOCAL_ADDRESS);