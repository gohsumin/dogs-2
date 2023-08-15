export class DogFeed {
	constructor(breed, subBreeds, currentSubBreed = null) {
		if (!breed || !subBreeds) {
			return null;
		}
		this.breed = breed;
		this.subBreeds = subBreeds;
		this.currentSubBreed = currentSubBreed;
		if (subBreeds.length) {
			this.images = subBreeds.reduce((sofar, subBreed) => {
				return { ...sofar, [subBreed]: [] };
			}, {});
		} else {
			this.images = { all: [] };
		}
	}

	async initDogFeed() {
		this.makeDogFeed();
		this.makeNavSubBreedList();
	}

	getDogFeed() {
		return this.$dogFeed;
	}

	makeDogFeed() {
		const $dogFeed = document.createElement('div');
		$dogFeed.className = 'dog-feed';
		const keys = this.currentSubBreed
			? [this.currentSubBreed]
			: this.subBreeds.length
				? this.subBreeds
				: ['all'];
		keys.forEach(key => {
			this.images[key].forEach(img => {
				const $img = new Image();
				$img.addEventListener('load', () => {
					if (key !== 'all') {
						$img.setAttribute('subBreed', key);
					}
					$dogFeed.append($img);
				});
				$img.src = img;
			});
		});
		this.$dogFeed = $dogFeed;
	}

	makeNavSubBreedList() {
		if (this.subBreeds.length) {
			const $subBreedList = document.createElement('div');
			$subBreedList.className = 'nav-subbreed-list';
			for (const sb of this.subBreeds) {
				const $subBreedTag = document.createElement('a');
				$subBreedTag.className = `nav-subbreed-tag${sb === this.currentSubBreed ? ' current' : ''}`;
				$subBreedTag.innerHTML = sb;
				$subBreedTag.href = this.currentSubBreed ? `${sb}` : `${this.breed}/${sb}`;
				$subBreedList.append($subBreedTag);
			}
			document.querySelector('.nav-left').append($subBreedList);
		}
	}
}