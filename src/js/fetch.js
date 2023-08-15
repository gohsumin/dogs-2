export async function getDogs() {
	const response = await fetch('https://dog.ceo/api/breeds/list/all');
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		throw Error();
	}
}

export async function getDog(breed) {
	const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		console.log(`https://dog.ceo/api/breed/${breed}/list`);
		throw Error();
	}
}

export async function getDogImages(mainBreed, subBreed = null, n = 8) {
	const response = await fetch(`https://dog.ceo/api/breed/${mainBreed}${subBreed ? `/${subBreed}` : ''}/images/random/${n}`);
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		throw Error();
	}
}