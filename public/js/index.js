/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');

// delegation
if (mapBox) {
    a;
    const locations = JSON.parse(
        document.getElementById('map').dataset.locations
    );
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if (formUserData) {
    formUserData.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateSettings({ name, email }, 'data');
    });
}

if (formUserPassword) {
    formUserPassword.addEventListener('submit', async e => {
        e.preventDefault();

		document.querySelector('.btn--save-password').textContent = 'Updating...';

        const currentPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const confirmNewPassword = document.getElementById('password-confirm').value;

        await updateSettings({ currentPassword, newPassword, confirmNewPassword }, 'password');

		document.querySelector('.btn--save-password').textContent = 'Save Password';

		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
    });
}