export function initNavBar() {
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
}