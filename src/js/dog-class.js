import { getDogImages } from './fetch.js';

export class Dog {
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

	async getAssets(numImages) {
		if (this.subBreeds.length) {
			const numSubBreedImages = this.getNumSubBreedImages(numImages);
			for (const subBreed of this.subBreeds) {
				const imgArr = await getDogImages(this.breed, subBreed, numSubBreedImages);
				let temp = this.images[subBreed].concat(imgArr);
				this.images[subBreed] = Array.from(new Set(temp));
			}
		} else {
			const imgArr = await getDogImages(this.breed, null, numImages);
			let temp = this.images.all.concat(imgArr);
			this.images.all = Array.from(new Set(temp));
		}
	}

	getNumSubBreedImages(numImages) {
		return (numImages / this.subBreeds.length < 10)
			? 10
			: (numImages / this.subBreeds.length);
	}
}