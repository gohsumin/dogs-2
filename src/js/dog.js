document.addEventListener('DOMContentLoaded', () => {
	const breed = window.location.pathname.match(/[a-z]+$/)[0];
	console.log(breed);
});