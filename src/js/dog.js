import { DogFeed } from './dogfeed-class.js';

document.addEventListener('DOMContentLoaded', async () => {
	const $script = document.querySelector('script#dog');
	const dog = JSON.parse($script.getAttribute('dog'));
	const subBreed = JSON.parse($script.getAttribute('subBreed'));
	const dogFeed = Object.assign(new DogFeed, (subBreed !== '') ? { ...dog, currentSubBreed: subBreed } : dog);
	await dogFeed.initDogFeed();
	document.querySelector('main').append(dogFeed.getDogFeed());
});