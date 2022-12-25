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