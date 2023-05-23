'use strict'

const passwordField = document.querySelector('#password-input');
const loginModal = document.querySelector('.login-overlay');
const logInfield = document.querySelector('#login-input');
const logInBtn = document.querySelector('#login-button');
const loginWind = document.querySelector('.login-modal');


const userData = {
    login: 'admin',
    password: '12345',
};

export default function LoginWindow() {
    logInBtn.addEventListener('click', () => {
        const trimmedLoginValue = logInfield.value.trim();

        if (userData.login === trimmedLoginValue) {
            if (userData.password === passwordField.value) {
                loginModal.remove();
            }
            else if (passwordField.value !== userData.password) {
                const throwErr = document.createElement('p');

                passwordField.style.border = '1px solid red';
                passwordField.classList.add('shake-animation');
                throwErr.setAttribute('id', 'error-msg');
                throwErr.textContent = 'Typed password is incorrect';

                setTimeout(() => {
                    passwordField.style.removeProperty('border');
                    throwErr.remove();
                }, 2500);

                setTimeout(() => {
                    passwordField.classList.remove('shake-animation');
                }, 350);

                loginWind.appendChild(throwErr);
                loginModal.appendChild(loginWind);
                document.body.appendChild(loginModal);
            }
        }

        else if (trimmedLoginValue !== userData.login) {

            const throwErr = document.createElement('p');

            logInfield.style.border = '1px solid red';
            logInfield.classList.add('shake-animation');
            throwErr.setAttribute('id', 'error-msg');
            throwErr.textContent = 'Typed login is incorrect';

            setTimeout(() => {
                logInfield.style.removeProperty('border');
                throwErr.remove();
            }, 2500);

            setTimeout(() => {
                logInfield.classList.remove('shake-animation');
            }, 350);

            loginWind.appendChild(throwErr);
            loginModal.appendChild(loginWind);
            document.body.appendChild(loginModal);
        }

    });
}
