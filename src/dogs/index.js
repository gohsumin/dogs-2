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
		Object.keys(images).forEach(subBreed => {
			images[subBreed].forEach(img => {
				const $img = new Image();
				const $slide = document.createElement('div');
				$slide.className = `slide ${subBreed}`;
				$slide.append($img);
				$slideshow.append($slide);
				$img.addEventListener('error', () => {
					$slide.remove();
				});
				$img.src = img;
			});
		});
	} else if (Array.isArray(images)) {
		images.forEach(img => {
			const $img = new Image();
			const $slide = document.createElement('div');
			$slide.className = 'slide';
			$slide.append($img);
			$slideshow.append($slide);
			$img.addEventListener('error', () => {
				$slide.remove();
			});
			$img.src = img;
		});
	}
	let scrollTimestamp;
	let idle;
	$slideshow.addEventListener('wheel', (event) => {
		scrollTimestamp = new Date().getTime();
		const scrollLeft = event.currentTarget.scrollLeft;
		idle = false;
		setTimeout(() => {
			if (!idle && new Date().getTime() - scrollTimestamp >= 50) {
				const width = $slideshow.clientWidth;
				const rightPriority = scrollLeft % width > width / 2 ? width : 0;
				const scrollTo = (Math.floor(scrollLeft / width) + (rightPriority ? 1 : 0)) * width;
				console.log(`Math.floor(scrollLeft / width) = ${scrollLeft / width}`);
				console.log(`scrollLeft=${scrollLeft}, width=${width}, rightPriority=${rightPriority}, scrollTo=${scrollTo}`);
				$slideshow.scroll({ left: scrollTo, behavior: 'smooth' });
				idle = true;
				scrollTimestamp = new Date().getTime();
			}
		}, 50);
	});
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
					? 3
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