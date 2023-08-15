import { DogCard } from './dogcard-class.js';

document.addEventListener('DOMContentLoaded', async () => {
	displayCards();
});

function displayCards() {
	const $cards = document.createElement('ul');
	$cards.className = 'cards';
	const $script = document.querySelector('script#all-dogs');
	const dogs = JSON.parse($script.getAttribute('dogs'));
	window.dogs = [];
	for (const dog of Object.values(dogs)) {
		const dogCard = Object.assign(new DogCard, dog);
		dogCard.initCard().then(() => {
			window.dogs.push(dogCard);
			$cards.append(dogCard.getCard());
		});
		window.addEventListener('resize', () => {
			dogCard.setPaginatorVisibility();
		});
	}
	document.querySelector('main').append($cards);
}