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

function addPaginators($slideshow) {
	const paginator = (className) => {
		const $paginator = document.createElement('div');
		$paginator.className = className;
		return $paginator;
	}
	$slideshow.insertAdjacentElement('afterend', paginator('scroll-right hide'));
	$slideshow.insertAdjacentElement('afterend', paginator('scroll-left hide'));
}

function setPaginatorVisibility($slideshowContainer) {
	const $slideshow = $slideshowContainer.querySelector('.slideshow');
	const $left = $slideshowContainer.querySelector('.scroll-left');
	const $right = $slideshowContainer.querySelector('.scroll-right');

	if ($left) {
		if ($slideshow.scrollLeft === 0) {
			$left.classList.add('hide');
		} else {
			$left.classList.remove('hide');
		}
	}
	if ($right) {
		if ($slideshow.scrollLeft + $slideshow.clientWidth >= $slideshow.scrollWidth) {
			$right.classList.add('hide');
		} else {
			$right.classList.remove('hide');
		}
	}
}

const cards = {};

function makeSlideshow(mainBreed) {
	const $slideshowContainer = document.createElement('div');
	$slideshowContainer.className = 'slideshow-container';
	const $slideshow = document.createElement('div');
	$slideshow.className = `slideshow ${mainBreed}`;
	$slideshowContainer.append($slideshow);
	let count = 0;

	const images = cards[mainBreed].images;

	if (!Array.isArray(images)) {
		Object.keys(images).forEach(subBreed => {
			images[subBreed].forEach(img => {
				const $img = new Image();
				$img.addEventListener('load', () => {
					const $slide = document.createElement('div');
					$slide.className = `slide ${subBreed}`;
					$slide.append($img);
					$slideshow.append($slide);
					count++;
					if (count === 2) {
						setPaginatorVisibility($slideshowContainer);
					}
				});
				$img.src = img;
			});
		});
	} else if (Array.isArray(images)) {
		images.forEach(img => {
			const $img = new Image();
			$img.addEventListener('load', () => {
				const $slide = document.createElement('div');
				$slide.className = 'slide';
				$slide.append($img);
				$slideshow.append($slide);
				count++;
				if (count === 2) {
					setPaginatorVisibility($slideshowContainer);
				}
			});
			$img.src = img;
		});
	}

	addPaginators($slideshow);

	let scrollTimestamp;
	let idle;
	const idleTime = 200;
	$slideshow.addEventListener('scroll', () => {
		idle = false;
		scrollTimestamp = new Date().getTime();
		setTimeout(() => {
			if (!idle && new Date().getTime() - scrollTimestamp >= idleTime) {
				setPaginatorVisibility($slideshow.closest('.slideshow-container'));
				idle = true;
				scrollTimestamp = new Date().getTime();
			}
		}, idleTime);
	});
	return $slideshowContainer;
}

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $ul = document.createElement('ul');
		Object.keys(dogs).forEach(async mainBreed => {
			const $li = document.createElement('li');
			$li.className = `card ${mainBreed}`;
			const $name = document.createElement('div');
			$name.className = 'dog-name';
			$name.innerHTML = mainBreed;
			$li.append($name);
			const minNumImages = 20;

			if (dogs[mainBreed].length) {
				const $innerUl = document.createElement('ul');
				$innerUl.className = 'sub-list';
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

			const $slideshowContainer = makeSlideshow(mainBreed);
			$li.append($slideshowContainer);

			$ul.append($li);

		});
		document.querySelector('main').append($ul);
	});
});