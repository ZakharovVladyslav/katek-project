'use strict';

import CustomStorage from '../Storage/Local-Storage.js';

const Storage = new CustomStorage();

const passwordField: HTMLInputElement | null = document.querySelector('#password-input');
const logInfield: HTMLInputElement | null = document.querySelector('#login-input');
const logInBtn: HTMLButtonElement | null = document.querySelector('#login-button');
const loginWind: HTMLDivElement | null = document.querySelector('#login-modal');
const loginOverlay: HTMLDivElement | null = document.querySelector('#login-overlay');
const loginWrapper: HTMLDivElement | null = document.querySelector('#login-wrapper');
const passwordWrapper: HTMLDivElement | null = document.querySelector('#password-wrapper');
const savePasswordCheckbox: HTMLInputElement | null = document.querySelector('#save-password-checkbox-input');

const userData = {
	login: 'admin',
	password: '12345',
};

export default function LoginWindow() {
	if (loginOverlay)
		loginOverlay.style.display = 'flex';

	logInBtn?.addEventListener('click', () => {
		Storage.setItem('login', logInfield?.value);
		Storage.setItem('password', passwordField?.value);

		const trimmedLoginValue = logInfield?.value.trim();

		if (userData.login === Storage.items.login.trim()) {

			if (userData.password === Storage.items.password) {
				if (savePasswordCheckbox?.checked) {
					sessionStorage.setItem('login', Storage.items.login);
					sessionStorage.setItem('password', Storage.items.password);
				}

				loginOverlay?.remove();
			}
			else if (passwordField?.value !== userData.password) {
				const throwErr = document.createElement('p');

				if (passwordWrapper)
					passwordWrapper.style.border = '1px solid red';

				passwordWrapper?.classList.add('shake-animation');
				throwErr.setAttribute('id', 'error-msg');
				throwErr.textContent = 'Typed password is incorrect';

				setTimeout(() => {
					passwordWrapper?.style.removeProperty('border');
					throwErr.remove();
				}, 2500);

				setTimeout(() => {
					passwordWrapper?.classList.remove('shake-animation');
				}, 350);

				loginWind?.appendChild(throwErr);

				if (loginWind)
					loginOverlay?.appendChild(loginWind);
				if (loginOverlay)
					document.body.appendChild(loginOverlay?.cloneNode(true));

			}
		}

		else if (trimmedLoginValue !== userData.login) {
			const throwErr = document.createElement('p');

			if (loginWrapper)
				loginWrapper.style.border = '1px solid red';

			loginWrapper?.classList.add('shake-animation');
			throwErr.setAttribute('id', 'error-msg');
			throwErr.textContent = 'Typed login is incorrect';

			setTimeout(() => {
				loginWrapper?.style.removeProperty('border');
				throwErr.remove();
			}, 2500);

			setTimeout(() => {
				loginWrapper?.classList.remove('shake-animation');
			}, 350);

			loginWind?.appendChild(throwErr);
			if (loginWind)
				loginOverlay?.appendChild(loginWind);
			if (loginOverlay)
				document.body.appendChild(loginOverlay);
		}
	});
}
