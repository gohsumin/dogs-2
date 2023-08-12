import { getDogImages } from './fetch.js';

export class Dog {

	constructor(breed, subBreeds) {
		this.breed = breed;
		this.subBreeds = subBreeds;
	}
	
	async initCard() {
		this.makeCard();
		this.makeSubBreedList();
		this.startLoading();
		this.makeSlideshow((() => {
			this.setPaginatorVisibility();
			this.stopLoading();
		}).bind(this));
	}

	async initDogFeed(subBreed) {
		await this.getAssets(200);
		const $dogFeed = document.createElement('div');
		$dogFeed.className = 'dog-feed';
		if (!Array.isArray(this.images)) {
			Object.keys(this.images).forEach(subBreed => {
				this.images[subBreed].forEach(img => {
					const $img = new Image();
					$img.addEventListener('load', () => {
						$img.setAttribute('subBreed', subBreed);
						$dogFeed.append($img);
					});
					$img.src = img;
				});
			});
		} else {
			this.images.forEach(img => {
				const $img = new Image();
				$img.addEventListener('load', () => {
					$dogFeed.append($img);
				});
				$img.src = img;
			});
		}
		this.$dogFeed = $dogFeed;

		if (this.subBreeds) {
			const $subBreedList = document.createElement('div');
			$subBreedList.className = 'nav-subbreed-list';
			for (const sb of this.subBreeds) {
				const $subBreedTag = document.createElement('a');
				$subBreedTag.className = `nav-subbreed-tag${sb === subBreed ? ' current' : ''}`;
				$subBreedTag.innerHTML = sb;
				$subBreedTag.href = `../${this.breed}/${sb}`;
				$subBreedList.append($subBreedTag);
			}
			document.querySelector('.nav-left').append($subBreedList);
		}
	}

	async getAssets(minNumImages) {
		if (this.subBreeds.length) {
			const numSubBreedImages = (minNumImages / this.subBreeds.length < 10)
				? 10
				: (minNumImages / this.subBreeds.length);
			let subBreedImages = {};
			for (const subBreed of this.subBreeds) {
				subBreedImages[subBreed] = await getDogImages(this.breed, subBreed, numSubBreedImages);
			}
			this.images = subBreedImages;
		} else {
			this.images = await getDogImages(this.breed, null, minNumImages);
		}
	}

	getDogFeed() {
		return this.$dogFeed;
	}

	getCard() {
		return this.$card;
	}

	makeCard() {
		const $card = document.createElement('li');
		$card.className = `card`;
		$card.setAttribute('breed', this.breed);
		const $name = document.createElement('a');
		$name.href = `dogs/${this.breed}`;
		$name.className = 'dog-name';
		$name.innerHTML = `<span></span>${this.breed}`;
		$card.append($name);
		this.$card = $card;
	}

	makeSubBreedList() {
		if (this.subBreeds.length) {
			const $subBreedList = document.createElement('ul');
			$subBreedList.className = 'subbreed-list';
			for (const subBreed of this.subBreeds) {
				const $subBreedTag = document.createElement('li');
				$subBreedTag.className = 'subbreed-tag';
				$subBreedTag.innerHTML = subBreed;
				this.addSubBreedTagListener($subBreedTag, subBreed);
				$subBreedList.append($subBreedTag);
			}
			this.$card.append($subBreedList);
		}
	}

	makeSlideshow(callback) {
		const $slideshowContainer = document.createElement('div');
		$slideshowContainer.className = 'slideshow-container';
		const $slideshow = document.createElement('div');
		$slideshow.className = `slideshow ${this.breed}`;
		$slideshowContainer.append($slideshow);
		let count = 0;
	
		if (!Array.isArray(this.images)) {
			Object.keys(this.images).forEach(subBreed => {
				this.images[subBreed].forEach(img => {
					const $img = new Image();
					$img.addEventListener('load', () => {
						const $slide = document.createElement('div');
						$slide.className = `slide`;
						$slide.setAttribute('subBreed', subBreed);
						$slide.append($img);
						$slideshow.append($slide);
						count++;
						if (count === 1) {
							callback();
						}
						if (count === 2) {
							this.addPaginator($slideshow, 'left', true);
							this.addPaginator($slideshow, 'right');
						}
						this.addImageListener($img);
					});
					$img.src = img;
				});
			});
		} else if (Array.isArray(this.images)) {
			this.images.forEach(img => {
				const $img = new Image();
				$img.addEventListener('load', () => {
					const $slide = document.createElement('div');
					$slide.className = 'slide';
					$slide.append($img);
					$slideshow.append($slide);
					count++;
					if (count === 1) {
						callback();
					}
					if (count === 2) {
						this.addPaginator($slideshow, 'left', true);
						this.addPaginator($slideshow, 'right');
					}
					this.addImageListener($img);
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
					this.setPaginatorVisibility();
					idle = true;
					scrollTimestamp = new Date().getTime();
				}
			}, idleTime);
		});
		this.$card.append($slideshowContainer);
	}

	startLoading() {
		this.$card.classList.add('loading');
	}

	stopLoading() {
		this.$card.classList.remove('loading');
	}

	setPaginatorVisibility() {
		const $slideshowContainer = this.$card.querySelector('.slideshow-container');
		if (!$slideshowContainer) return;
		const $slideshow = $slideshowContainer.querySelector('.slideshow');
		const $left = $slideshowContainer.querySelector('.scroll-left');
		const $right = $slideshowContainer.querySelector('.scroll-right');
	
		if ($left) {
			if ($slideshow.scrollLeft === 0) {
				$left.classList.add('opacity-0');
			} else {
				$left.classList.remove('opacity-0');
			}
		}
		if ($right) {
			if ($slideshow.scrollLeft + $slideshow.clientWidth + 1 >= $slideshow.scrollWidth) {
				$right.classList.add('opacity-0');
			} else {
				$right.classList.remove('opacity-0');
			}
		}
	}

	addPaginator($slideshow, direction, opacity0 = false) {
		const $paginator = document.createElement('div');
		$paginator.className = `scroll-${direction}${opacity0 ? ' opacity-0' : ''}`;
	
		$paginator.addEventListener('click', () => {
			$slideshow.scroll({
				left: $slideshow.scrollLeft + ((direction === 'left') ? -1 : 1) * $slideshow.clientWidth,
				behavior: 'smooth'
			});
		});
	
		$slideshow.insertAdjacentElement('afterend', $paginator);
	}

	addImageListener($img) {
		$img.addEventListener('click', () => {
			$img.classList.toggle('clicked');
		});
	}

	addSubBreedTagListener($subBreedTag, subBreed) {
		$subBreedTag.addEventListener('click', (event) => {
			if (this.$card.getAttribute('subbreed-filter') === subBreed) {
				this.$card.removeAttribute('subbreed-filter');
				this.$card.querySelector('.dog-name span').innerHTML = '';
				this.$card.querySelector('.dog-name').href = `dogs/${this.breed}`;
				event.currentTarget.classList.remove('selected');
				this.$card.querySelectorAll(`.slide.hide`).forEach($slide => {
					$slide.classList.remove('hide');
				});
			} else {
				this.$card.setAttribute('subbreed-filter', subBreed);
				this.$card.querySelector('.dog-name span').innerHTML = subBreed;
				this.$card.querySelector('.dog-name').href = `dogs/${this.breed}/${subBreed}`;
				this.$card.querySelector('.selected')?.classList.remove('selected');
				event.currentTarget.classList.add('selected');
				this.$card.querySelectorAll(`.slide`).forEach($slide => {
					if ($slide.getAttribute('subBreed') === subBreed) {
						$slide.classList.remove('hide');
					} else {
						$slide.classList.add('hide');
					}
				});
			}
		});
	}
}