import { getDogImages, getDogs } from './fetch.js';
import { makeSlideshow, makeCard, initNavBar } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $ul = document.createElement('ul');
		Object.keys(dogs).forEach(async mainBreed => {
			const $card = makeCard(mainBreed);
			const subBreeds = dogs[mainBreed];
			const minNumImages = 20;
			let images;
			if (subBreeds.length) {
				const $subBreedList = document.createElement('ul');
				$subBreedList.className = 'sub-list';
				const numSubBreedImages = (minNumImages / subBreeds.length < 1)
					? 3
					: (minNumImages / subBreeds.length);
				let subBreedImages = {};
				for (const subBreed of subBreeds) {
					const $subBreedTag = document.createElement('li');
					$subBreedTag.innerHTML = subBreed;
					$subBreedList.append($subBreedTag);
					subBreedImages[subBreed] = await getDogImages(mainBreed, subBreed, numSubBreedImages);
				}
				$card.append($subBreedList);

				images = subBreedImages;
			} else {
				images = await getDogImages(mainBreed, null, minNumImages);
			}

			const $slideshowContainer = makeSlideshow(mainBreed, images);
			$card.append($slideshowContainer);

			$ul.append($card);

		});
		document.querySelector('main').append($ul);
	});

	initNavBar();
});