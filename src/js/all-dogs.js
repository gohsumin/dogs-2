import { getDogs } from './fetch.js';
import { Dog } from './dog-class.js';

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $cards = document.createElement('ul');
		$cards.className = 'cards';
		window.dogs = [];
		Object.keys(dogs).forEach(mainBreed => {
			const dog = new Dog(mainBreed, dogs[mainBreed]);
			window.dogs[dog.breed] = dog;
			$cards.append(dog.getCard());
			dog.init();
		});
		document.querySelector('main').append($cards);
	});
});