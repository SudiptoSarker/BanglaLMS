import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method not allowed' });
    }

    const { cancel, user, act } = req.query;

    // Check if the required parameters have values
    if (!cancel || !user || !act) {
        // If any of the required parameters are missing
        return res.status(400).send({
            success: false,
            message: 'Missing required parameters',
            user: user || null,
            cancel: cancel || null

        });
    }

    try {
        return res.status(200).send({
            success: true,           
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        });
    }
}
