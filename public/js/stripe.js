/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
    try {
        const stripe = Stripe(
            'pk_test_51MNxwfCljId4phulhz2JA5J3A1Pfbg6KVNJqbjJpT7wIzeEKBgrPiXaLhAZPacp7ynEbFpfp2yYbLPt80gBt49xl006KgmQpaw'
        );

        // get the checkout session from API
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
        );

        console.log(session);

        // create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
