async function getDogs() {
	const response = await fetch('https://dog.ceo/api/breeds/list/all');
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		throw Error();
	}
}

async function getDogImages(mainBreed, subBreed = null, n = 8) {
	const response = await fetch(`https://dog.ceo/api/breed/${mainBreed}${subBreed ? `/${subBreed}` : ''}/images/random/${n}`);
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		throw Error();
	}
}

const cards = {};

function makeSlideshow(mainBreed) {
	const $slideshow = document.createElement('div');
	$slideshow.className = `slideshow ${mainBreed}`;
	const images = cards[mainBreed].images;
	if (!Array.isArray(images)) {
		Object.getOwnPropertyNames(images).forEach(subBreed => {
			images[subBreed].forEach(img => {
				const $slide = document.createElement('div');
				$slide.className = `slide ${subBreed}`;
				const $img = document.createElement('img');
				$img.src = img;
				$slide.append($img);
				$slideshow.append($slide);
			});
		});
	} else if (Array.isArray(images)) {
		images.forEach(img => {
			const $slide = document.createElement('div');
			$slide.className = 'slide';
			const $img = document.createElement('img');
			$img.src = img;
			$slide.append($img);
			$slideshow.append($slide);
		});
	}
	return $slideshow;
}

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $ul = document.createElement('ul');
		Object.keys(dogs).forEach(async mainBreed => {
			const $li = document.createElement('li');
			const $name = document.createElement('div');
			$name.className = 'dog-name';
			$name.innerHTML = mainBreed;
			$li.append($name);
			const minNumImages = 20;

			if (dogs[mainBreed].length) {
				const $innerUl = document.createElement('ul');
				const numSubBreedImages = (minNumImages / dogs[mainBreed].length < 1)
					? (dogs[mainBreed].length * 2)
					: (minNumImages / dogs[mainBreed].length);
				let subBreedImages = {};
				for (subBreed of dogs[mainBreed]) {
					const $innerLi = document.createElement('li');
					$innerLi.innerHTML = subBreed;
					$innerUl.append($innerLi);
					subBreedImages[subBreed] = await getDogImages(mainBreed, subBreed, numSubBreedImages);
				}
				$li.append($innerUl);

				cards[mainBreed] = { images: subBreedImages };
			} else {
				cards[mainBreed] = { images: await getDogImages(mainBreed, null, minNumImages) };
			}

			const $slideshow = makeSlideshow(mainBreed);
			$li.append($slideshow);
			$ul.append($li);

		});
		document.querySelector('main').append($ul);
	});
});