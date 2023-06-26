'use strict';

import ldap from 'ldapjs';
import CustomStorage, { ICustomStorage } from '../../services/Storage/CustomStorage.js';

const Storage: ICustomStorage = new CustomStorage();

const passwordField: HTMLInputElement | null = document.querySelector('#password-input');
const logInfield: HTMLInputElement | null = document.querySelector('#login-input');
const logInBtn: HTMLButtonElement | null = document.querySelector('#login-button');
const loginWind: HTMLDivElement | null = document.querySelector('#login-modal');
const loginOverlay: HTMLDivElement | null = document.querySelector('#login-overlay');
const passwordWrapper: HTMLDivElement | null = document.querySelector('#password-wrapper');
const savePasswordCheckbox: HTMLInputElement | null = document.querySelector('#save-password-checkbox-input');

const ldapServerURL = 'ldap://srv01-dc10';
const ldapBaseDN = 'cn=Mykhailo Syrota,ou=KATEKazure,dc=katek,dc=int';

export default function LoginWindow() {
	loginOverlay?.setAttribute('style', 'display: flex;');

	const handleLoginBtnClick = () => {
		Storage.setItem('login', logInfield?.value);
		Storage.setItem('password', passwordField?.value);

		/*const client = ldap.createClient({
			url: ldapServerURL,
		});*/

		const trimmedLoginValue = logInfield?.value.trim();

		const password = passwordField?.value;

		if (!password) {
			throw new Error('Password field is not available');
		}

		/*client.bind(ldapBaseDN, password, (error) => { // passwordField?.value occurs error - rgument of type 'string | undefined' is not assignable to parameter of type 'string'. Type 'undefined' is not assignable to type 'string'.ts(2345)
			if (error) {
				const throwErr = document.createElement('p');

				passwordField?.setAttribute('style', 'border: 1px solid red');

				passwordWrapper?.classList.add('shake-animation');
				throwErr.setAttribute('id', 'error-msg');
				throwErr.textContent = 'Typed password is incorrect';

				passwordWrapper?.setAttribute('style', 'border: 1px solid red;');
				passwordField?.classList.add('shake-animation');

				setTimeout(() => {
					passwordWrapper?.style.removeProperty('border');
					throwErr.remove();
				}, 2500);

				setTimeout(() => {
					passwordWrapper?.classList.remove('shake-animation');
				}, 350);

				loginWind?.appendChild(throwErr);

				if (loginOverlay && loginWind) {
					loginOverlay?.appendChild(loginWind);
					document.body.appendChild(loginOverlay);
				}
			} else {
				if (savePasswordCheckbox?.checked) {
					sessionStorage.setItem('login', Storage.items.login);
					sessionStorage.setItem('password', Storage.items.password);
				}

				loginOverlay?.remove();
			}
		});

		client.unbind((error) => {
			if (error) {
				console.error('Error unbinding from LDAP server:', error);
			}
		});*/
	};
	logInBtn?.addEventListener('click', handleLoginBtnClick);
	logInBtn?.removeEventListener('click', handleLoginBtnClick);
}
