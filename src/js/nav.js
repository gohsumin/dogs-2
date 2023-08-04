document.addEventListener('DOMContentLoaded', () => {
	initNavBar();
});

function initNavBar() {
	const $nav = document.querySelector('nav');

	let scrollTimestamp;
	let idle;
	const idleTime = 10;
	window.addEventListener('wheel', () => {
		idle = false;
		scrollTimestamp = new Date().getTime();
		setTimeout(() => {
			if (!idle && new Date().getTime() - scrollTimestamp >= idleTime) {
				if (document.documentElement.scrollTop < 30) {
					$nav.style.height = (80 - document.documentElement.scrollTop) + 'px';
				} else {
					$nav.style.removeProperty('height');
				}
				idle = true;
				scrollTimestamp = new Date().getTime();
			}
		}, idleTime);
	});

	const $gridButton = $nav.querySelector('.grid');
	const $listButton = $nav.querySelector('.list');
	$nav.querySelector('.view-type').addEventListener('click', (event) => {
		if (event.target.isSameNode($listButton) && event.currentTarget.classList.contains('grid-view')) {
			event.currentTarget.classList.remove('grid-view');
			event.currentTarget.classList.add('list-view');
			Object.keys(window.dogs).forEach(breed => {
				window.dogs[breed].setPaginatorVisibility();
			});
		} else if (event.target.isSameNode($gridButton) && event.currentTarget.classList.contains('list-view')) {
			event.currentTarget.classList.remove('list-view');
			event.currentTarget.classList.add('grid-view');
		}
	})
}