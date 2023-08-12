import { Dog } from './dog-class.js';

document.addEventListener('DOMContentLoaded', async () => {
	const $script = document.querySelector('script#dog');
	const dog = JSON.parse($script.getAttribute('dog'));
	const dogObj = Object.assign(new Dog, dog);
	const subBreed = JSON.parse($script.getAttribute('subBreed'));
	await dogObj.initDogFeed(subBreed);
	document.querySelector('main').append(dogObj.getDogFeed());
});