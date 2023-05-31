'use strict';
import ldap from 'ldapjs';
import CustomStorage from '../Storage/Local-Storage.js';
const Storage = new CustomStorage();
const passwordInput = document.querySelector('#password-input');
const loginInput = document.querySelector('#login-input');
const logInBtn = document.querySelector('#login-button');
const loginModal = document.querySelector('#login-modal');
const loginOverlay = document.querySelector('#login-overlay');
const passwordWrapper = document.querySelector('#password-wrapper');
const savePasswordCheckboxInput = document.querySelector('#save-password-checkbox-input');
const ldapServerURL = 'ldap://srv01-dc10';
const ldapBaseDN = 'cn=Mykhailo Syrota,ou=KATEKazure,dc=katek,dc=int';
export default function LoginWindow() {
    console.log('Login Window works');
    loginOverlay?.setAttribute('style', 'display: flex');
    logInBtn?.addEventListener('click', () => {
        console.log('Login window works');
        Storage.setItem('login', loginInput?.value);
        Storage.setItem('password', passwordInput?.value);
        const client = ldap.createClient({
            url: ldapServerURL,
        });
        const password = passwordInput?.value;
        if (password) {
            client.bind(ldapBaseDN, password, (error) => {
                if (error && loginModal && loginOverlay) {
                    const throwErr = document.createElement('p');
                    passwordWrapper?.setAttribute('style', 'border: 1px solid red;');
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
                    loginModal?.appendChild(throwErr);
                    loginOverlay?.appendChild(loginModal);
                    document.body.appendChild(loginOverlay);
                }
                else {
                    if (savePasswordCheckboxInput?.checked) {
                        sessionStorage.setItem('login', Storage.items.login);
                        sessionStorage.setItem('password', Storage.items.password);
                    }
                    loginOverlay?.remove();
                }
            });
        }
        client.unbind((error) => {
            if (error) {
                console.error('Error unbinding from LDAP server:', error);
            }
        });
    });
}
