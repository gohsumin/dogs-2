import { getDogs, getDog } from './src/js/fetch.js';
import { Dog } from './src/js/dog-class.js';
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
let dogList = {};
const dogs = await getDogs();
for (const mainBreed of Object.keys(dogs)) {
	const dog = new Dog(mainBreed, dogs[mainBreed]);
	await dog.getAssets(200);
	dogList[mainBreed] = dog;
}

const dogPageMatches = (url) => {
	const match = url.match(/\/dogs\/([a-zA-Z ]+)\/*([a-zA-Z ]*)/);
	if (!match) {
		return false;
	}
	return {
		breed: match[1] === '' ? null : match[1],
		subBreed: match[2] === '' ? null : match[2]
	};
};

function processURL(url) {
	if (url === '/') {
		return { file: 'home.ejs', data: { url: url, dogs: dogList, breed: null }, status: 200 };
	}
	if (url === '/dogs') {
		return { file: 'all-dogs.ejs', data: { url: url, dogs: dogList, breed: null }, status: 200 };
	}
	const matches = dogPageMatches(url);
	if (matches) {
		if (dogList[matches.breed] !== undefined) {
			return { file: 'dog.ejs', data: { url: url, breed: matches.breed, dog: dogList[matches.breed], subBreed: matches.subBreed }, status: 200 };
		}
	}
	return { file: '404.ejs', data: {}, status: 404 };
}

function serveFile(url, res) {
	const ext = path.extname(url).slice(1);
	const contentType = fileTypes[ext];
	if (!contentType) {
		console.log(`unsupported: ${ext}`);
		return;
	}
	res.writeHead(200, { 'Content-type': contentType });
	fs.readFile(`${__dirname}/src/${ext}/${path.basename(url)}`, 'utf8', function (err, data) {
		if (err) throw err;
		res.end(data);
	});
}

function renderEJS(url, res) {
	const { file, data, status } = processURL(url);

	ejs.renderFile(`${__dirname}/src/ejs/${file}`, data, function (err, html) {
		if (err) throw err;
		res.statusCode = status;
		res.write(html);
	});
}

const server = http.createServer();

server.on('request', async (req, res) => {
	const { url } = req;
	req.on('error', (err) => {
		console.log(err);
	});

	if (path.extname(url)) {
		serveFile(url, res);
		return;
	}

	renderEJS(url, res);
	res.end();
});

server.listen(PORT, LOCAL_ADDRESS, () => {
	console.log(`listening at http://${LOCAL_ADDRESS}:${PORT}`);
});