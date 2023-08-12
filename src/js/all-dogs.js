import { Dog } from './dog-class.js';

document.addEventListener('DOMContentLoaded', () => {
	displayCards();
	window.addEventListener('resize', () => {
		window.dogs.forEach(dog => {
			dog.setPaginatorVisibility();
		});
	});
});

function displayCards() {
	const $cards = document.createElement('ul');
	$cards.className = 'cards';
	const $script = document.querySelector('script#all-dogs');
	const dogs = JSON.parse($script.getAttribute('dogs'));
	window.dogs = [];
	Object.values(dogs).forEach(dog => {
		const dogObj = Object.assign(new Dog, dog);
		dogObj.initCard();
		window.dogs.push(dogObj);
		$cards.append(dogObj.getCard());
	});
	document.querySelector('main').append($cards);
}