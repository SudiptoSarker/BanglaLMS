//import { queryDatabase } from "@/lib/config";
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method not allowed' });
    }

    const { purchase, subscription, user, act } = req.query;

    // Check if the required parameters have values
    if (!purchase || !subscription || !user || !act) {
        // If any of the required parameters are missing
        res.status(400).send({
            success: false,
            message: 'Missing required parameters',
            user: user || null,
            subscription: subscription || null,
            purchase: purchase || null

        });
    }

    // If all required parameters are present, return success
    try {
        // Generate a random 20-character license key (optional)
        const key = crypto.randomBytes(10).toString('hex'); 
        const currentDate = new Date();
        const validityDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        const formattedValidityDate = validityDate.toISOString().split('T')[0];
        res.status(200).send({
            success: true,
            key: key,
            purchase: purchase,
            subscription: subscription,
            user: user,
            validity:formattedValidityDate
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
}
