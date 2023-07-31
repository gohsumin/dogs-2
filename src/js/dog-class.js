import { getDogImages } from './fetch.js';

export class Dog {
	minNumImages = 20;

	constructor(breed, subBreeds) {
		this.breed = breed;
		this.subBreeds = subBreeds;
		this.makeSubBreedList();
		this.makeCard();
		this.startLoading();
	}

	async init() {
		await this.getAssets();
		this.makeSlideshow();
		this.stopLoading();
	}

	getCard() {
		return this.$card;
	}

	async getAssets() {
		if (this.subBreeds.length) {
			
			const numSubBreedImages = (this.minNumImages / this.subBreeds.length < 1)
				? 3
				: (this.minNumImages / this.subBreeds.length);
			let subBreedImages = {};
			for (const subBreed of this.subBreeds) {
				const $subBreedTag = document.createElement('li');
				$subBreedTag.innerHTML = subBreed;
				this.$subBreedList.append($subBreedTag);
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
		$name.innerHTML = this.breed;
		$card.append($name);
		if (this.$subBreedList) {
			$card.append(this.$subBreedList);
		}
		this.$card = $card;
	}

	makeSubBreedList() {
		if (this.subBreeds.length) {
			const $subBreedList = document.createElement('ul');
			$subBreedList.className = 'sub-list';
			this.$subBreedList = $subBreedList;
		}
	}

	makeSlideshow() {
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
					this.setPaginatorVisibility($slideshow.closest('.slideshow-container'));
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

	setPaginatorVisibility($slideshowContainer) {
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
			if ($slideshow.scrollLeft + $slideshow.clientWidth >= $slideshow.scrollWidth) {
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
}