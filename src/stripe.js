// src/stripe.js

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PQUla2MAGtg9B9CJl0dk6UnCllaAP7iXZVx7FnpTax3jSlJB6XRq61sybxLppSYNdr0FWVZsF9d6hzwzFqQm6Dc008iL6JSbA');

export default stripePromise;
