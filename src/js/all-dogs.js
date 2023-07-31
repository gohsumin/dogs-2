import { getDogs } from './fetch.js';
import { initNavBar } from './ui.js';
import { Dog } from './dog-class.js';

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $cards = document.createElement('ul');
		$cards.className = 'cards';
		Object.keys(dogs).forEach(mainBreed => {
			const dog = new Dog(mainBreed, dogs[mainBreed]);
			$cards.append(dog.getCard());
			dog.init();
		});
		document.querySelector('main').append($cards);
	});
	initNavBar();
});