
document.addEventListener('DOMContentLoaded', () => {
	const heading = document.querySelector('.p1.center');
	if (!heading) return;

	function adjustFont() {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		// scale between 1.5rem and 3rem depending on viewport width
		const min = 1.5; // rem
		const max = 3; // rem
		// Map vw from 320..1200 to min..max
		const t = Math.min(1, Math.max(0, (vw - 320) / (1200 - 320)));
		const size = min + (max - min) * t;
		heading.style.fontSize = size + 'rem';
	}

	adjustFont();
	window.addEventListener('resize', adjustFont);
});

