/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (result.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: 'http://127.0.0.1:3000/api/v1/users/logout',
		});

		if (res.data.status === 'success') {
			location.reload(true);
		}
	} catch (error) {
		showAlert('error', 'Error logging out! Try again.')
	}
}
// test some changesss