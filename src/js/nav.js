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
	$nav.querySelector('.view-type')?.addEventListener('click', (event) => {
		if (event.target.isSameNode($listButton) && event.currentTarget.classList.contains('grid-view')) {
			event.currentTarget.classList.remove('grid-view');
			event.currentTarget.classList.add('list-view');
			if (window.dogs) {
				window.dogs.forEach(dog => {
					dog.setPaginatorVisibility();
				});
			}
		} else if (event.target.isSameNode($gridButton) && event.currentTarget.classList.contains('list-view')) {
			event.currentTarget.classList.remove('list-view');
			event.currentTarget.classList.add('grid-view');
			if (window.dogs) {
				window.dogs.forEach(dog => {
					dog.setPaginatorVisibility();
				});
			}
		}
	});

	const filterCards = (event) => {
		const searchKey = event.currentTarget.value.toLowerCase();
		document.querySelectorAll('.card').forEach($card => {
			if ($card.getAttribute('breed').indexOf(searchKey) === 0) {
				$card.classList.remove('hide');
			} else {
				$card.classList.add('hide');
			}
		});
	}
	document.querySelector('.search input')?.addEventListener('input', filterCards);
	document.querySelector('.search input')?.addEventListener('focus', filterCards);
	document.querySelector('.search .clear')?.addEventListener('click', () => {
		document.querySelector('.search input').value = '';
		document.querySelectorAll('.card').forEach($card => {
			$card.classList.remove('hide');
		});
	});
}