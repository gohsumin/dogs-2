async function getDogs() {
	const response = await fetch('https://dog.ceo/api/breeds/list/all');
	const json = await response.json();
	if (json.status === 'success') {
		return json.message;
	} else {
		throw Error();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	getDogs().then(dogs => {
		const $ul = document.createElement('ul');
		Object.keys(dogs).forEach(mainBreed => {
			const $li = document.createElement('li');
			$li.innerHTML = mainBreed;
			if (dogs[mainBreed].length) {
				const $innerUl = document.createElement('ul');
				dogs[mainBreed].forEach(subBreed => {
					const $innerLi = document.createElement('li');
					$innerLi.innerHTML = subBreed;
					$innerUl.append($innerLi);
				})
				$li.append($innerUl);
			}
			$ul.append($li);
		});
		document.querySelector('main').append($ul);
	});
});