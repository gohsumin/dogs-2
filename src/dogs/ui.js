function addImageListener($img) {
	$img.addEventListener('click', () => {
		$img.classList.toggle('clicked');
	});
}

function addPaginator($slideshow, direction, hide = false) {
	const $paginator = document.createElement('div');
	$paginator.className = `scroll-${direction}${hide ? ' hide' : ''}`;

	$paginator.addEventListener('click', () => {
		$slideshow.scroll({
			left: $slideshow.scrollLeft + ((direction === 'left') ? -1 : 1) * $slideshow.clientWidth,
			behavior: 'smooth'
		});
	});

	$slideshow.insertAdjacentElement('afterend', $paginator);
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

export function makeSlideshow(mainBreed, images) {
	const $slideshowContainer = document.createElement('div');
	$slideshowContainer.className = 'slideshow-container';
	const $slideshow = document.createElement('div');
	$slideshow.className = `slideshow ${mainBreed}`;
	$slideshowContainer.append($slideshow);
	let count = 0;

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
						addPaginator($slideshow, 'left', true);
						addPaginator($slideshow, 'right');
					}
					addImageListener($img);
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
					addPaginator($slideshow, 'left', true);
					addPaginator($slideshow, 'right');
				}
				addImageListener($img);
			});
			$img.src = img;
		});
	}

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

export function makeCard(mainBreed) {
	const $card = document.createElement('li');
	$card.className = `card ${mainBreed}`;
	const $name = document.createElement('div');
	$name.className = 'dog-name';
	$name.innerHTML = mainBreed;
	$card.append($name);
	return $card;
}

export function initNavBar() {
	const $nav = document.querySelector('nav');

	let scrollTimestamp;
	let idle;
	const idleTime = 10;
	window.addEventListener('wheel', () => {
		idle = false;
		scrollTimestamp = new Date().getTime();
		setTimeout(() => {
			if (!idle && new Date().getTime() - scrollTimestamp >= idleTime) {
				if (document.documentElement.scrollTop < 30) {
					$nav.style.height = (80 - document.documentElement.scrollTop) + 'px';
				} else {
					$nav.style.removeProperty('height');
				}
				idle = true;
				scrollTimestamp = new Date().getTime();
			}
		}, idleTime);
	});
}