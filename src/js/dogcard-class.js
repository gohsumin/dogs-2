export class DogCard {
	constructor(breed, subBreeds) {
		if (!breed || !subBreeds) {
			return null;
		}
		this.breed = breed;
		this.subBreeds = subBreeds;
		if (subBreeds.length) {
			this.images = subBreeds.reduce((sofar, subBreed) => {
				return { ...sofar, [subBreed]: [] };
			}, {});
		} else {
			this.images = { all: [] };
		}
	}
	
	async initCard() {
		this.makeCard();
		this.makeSubBreedList();
		this.startLoadingCard();
		this.makeSlideshow((() => {
			this.setPaginatorVisibility();
			this.stopLoadingCard();
		}).bind(this));
	}

	getCard() {
		return this.$card;
	}

	makeCard() {
		const $card = document.createElement('li');
		$card.className = `card`;
		$card.setAttribute('breed', this.breed);
		const $name = document.createElement('a');
		$name.href = (this.subBreeds.length === 1) ? `dogs/${this.breed}/${this.subBreeds[0]}` : `dogs/${this.breed}`;
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
	
		Object.keys(this.images).forEach(key => {
			this.images[key].forEach(img => {
				const $img = new Image();
				$img.addEventListener('load', () => {
					const $slide = document.createElement('div');
					$slide.className = `slide`;
					if (key !== 'all') {
						$slide.setAttribute('subBreed', key);
					}
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

	startLoadingCard() {
		this.$card.classList.add('loading');
	}

	stopLoadingCard() {
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
				left: $slideshow.scrollLeft + ((direction === 'left') ? -1 : 1) * (document.querySelector('nav .view-type.list-view') ? 0.3 : 1) * $slideshow.clientWidth,
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
			if (this.currentSubBreed === subBreed) {
				this.currentSubBreed = null;
				this.$card.removeAttribute('subbreed-filter');
				this.$card.querySelector('.dog-name span').innerHTML = '';
				this.$card.querySelector('.dog-name').href = `dogs/${this.breed}`;
				event.currentTarget.classList.remove('selected');
				this.$card.querySelectorAll(`.slide.hide`).forEach($slide => {
					$slide.classList.remove('hide');
				});
			} else {
				this.currentSubBreed = subBreed;
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
			this.setPaginatorVisibility();
		});
	}
}