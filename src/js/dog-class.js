import { getDogImages } from './fetch.js';

export class Dog {
	minNumImages = 20;

	constructor(breed, subBreeds) {
		this.breed = breed;
		this.subBreeds = subBreeds;
		this.makeCard();
		this.makeSubBreedList();
		this.startLoading();
	}

	async init() {
		await this.getAssets();
		this.makeSlideshow((() => {
			this.stopLoading();
		}).bind(this));
	}

	getCard() {
		return this.$card;
	}

	async getAssets() {
		if (this.subBreeds.length) {
			const numSubBreedImages = (this.minNumImages / this.subBreeds.length < 10)
				? 10
				: (this.minNumImages / this.subBreeds.length);
			let subBreedImages = {};
			for (const subBreed of this.subBreeds) {
				subBreedImages[subBreed] = await getDogImages(this.breed, subBreed, numSubBreedImages);
			}
			this.images = subBreedImages;
		} else {
			this.images = await getDogImages(this.breed, null, this.minNumImages);
		}
	}

	makeCard() {
		const $card = document.createElement('li');
		$card.className = `card ${this.breed}`;
		const $name = document.createElement('div');
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
						$slide.className = `slide ${subBreed}`;
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
		const $slideshowContainer = this.$card.querySelector('.slideshow-container')
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
			if (this.$card.getAttribute('filter') === subBreed) {
				this.$card.removeAttribute('filter');
				this.$card.querySelector('.dog-name span').innerHTML = '';
				event.currentTarget.classList.remove('selected');
				this.$card.querySelectorAll(`.slide.hide`).forEach($slide => {
					$slide.classList.remove('hide');
				});
			} else {
				this.$card.setAttribute('filter', subBreed);
				this.$card.querySelector('.dog-name span').innerHTML = subBreed;
				this.$card.querySelector('.selected')?.classList.remove('selected');
				event.currentTarget.classList.add('selected');
				this.$card.querySelectorAll(`.slide`).forEach($slide => {
					if ($slide.classList.contains(subBreed)) {
						$slide.classList.remove('hide');
					} else {
						$slide.classList.add('hide');
					}
				});
			}
		});
	}
}