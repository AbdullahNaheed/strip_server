import { json } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
    if (req.method != 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { amount, currency, description } = await json(req);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency
        });
        res.status(200).json({clientSecret: paymentIntent.client_secret});

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

