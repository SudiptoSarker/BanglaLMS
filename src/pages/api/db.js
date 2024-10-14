import { queryDatabase } from '@/lib/config';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, values } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const rows = await queryDatabase(query, values);
        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
