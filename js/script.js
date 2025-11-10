(() => {
	const pwd = document.getElementById('password');
	const toggle = document.getElementById('toggleBtn');
	const bar = document.getElementById('strengthBar');
	const text = document.getElementById('strengthText');
	const typingAlert = document.getElementById('typingAlert');
	const criteriaIcons = document.querySelectorAll('[data-criterion]');

	const rules = {
		length8: /.{8,}/,
		length12: /.{12,}/,
		lower: /[a-z]/,
		upper: /[A-Z]/,
		number: /\d/,
		special: /[^A-Za-z0-9]/
	};

	function scorePassword(s) {
		let score = 0;
		if (rules.length8.test(s)) score += 1;
		if (rules.length12.test(s)) score += 1;
		if (rules.lower.test(s)) score += 1;
		if (rules.upper.test(s)) score += 1;
		if (rules.number.test(s)) score += 1;
		if (rules.special.test(s)) score += 1;
		return score;
	}

	function updateUI() {
		const value = pwd.value || '';
		const s = scorePassword(value);
		const max = 6;
		const pct = Math.round((s / max) * 100);

		bar.classList.remove('weak', 'fair', 'good');

		let label = 'Very weak';
		if (pct <= 20) { bar.classList.add('weak'); label = 'Very weak'; }
		else if (pct <= 50) { bar.classList.add('weak'); label = 'Weak'; }
		else if (pct <= 70) { bar.classList.add('fair'); label = 'Fair'; }
		else if (pct <= 90) { bar.classList.add('good'); label = 'Good'; }
		else { bar.classList.add('good'); label = 'Excellent'; }

		bar.style.width = pct + '%';
		bar.setAttribute('aria-valuenow', pct);
		text.textContent = label + (value ? ` (${pct}%)` : '');

		criteriaIcons.forEach(i => {
			const crit = i.getAttribute('data-criterion');
			let ok = false;
			switch (crit) {
				case 'length': ok = rules.length8.test(value); break;
				case 'lower': ok = rules.lower.test(value); break;
				case 'upper': ok = rules.upper.test(value); break;
				case 'number': ok = rules.number.test(value); break;
				case 'special': ok = rules.special.test(value); break;
			}
			if (ok) {
				i.classList.remove('bi-x-circle-fill','text-muted');
				i.classList.add('bi-check-circle-fill','met');
			} else {
				i.classList.remove('bi-check-circle-fill','met');
				i.classList.add('bi-x-circle-fill','text-muted');
			}
		});
	}

	toggle.addEventListener('click', () => {
		const type = pwd.type === 'password' ? 'text' : 'password';
		pwd.type = type;
		toggle.querySelector('i').classList.toggle('bi-eye');
		toggle.querySelector('i').classList.toggle('bi-eye-slash');
	});

	let typingTimer = null;
	const TYPING_DELAY = 700;

	function showTyping() {
		typingAlert.classList.remove('d-none');
	}
	function hideTyping() {
		typingAlert.classList.add('d-none');
	}

	pwd.addEventListener('input', () => {
		updateUI();
		showTyping();
		if (typingTimer) clearTimeout(typingTimer);
		typingTimer = setTimeout(() => {
			hideTyping();
		}, TYPING_DELAY);
	});


	pwd.addEventListener('focus', updateUI);
	pwd.addEventListener('blur', updateUI);


	document.addEventListener('DOMContentLoaded', () => updateUI());
	updateUI();
})();

