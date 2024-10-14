// pages/api/get-sites.js

import { queryDatabase } from '@/lib/config';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract planner_id from the query parameters
    const { planner_id } = req.query;

    // Check if planner_id is provided
    if (!planner_id) {
        return res.status(400).json({ error: 'Planner ID is required' });
    }

    // Update the query to filter by planner_id
    const query = `
        SELECT id, name, source, link, sourcetable AS tableName
        FROM [dbo].[SiteTable]
        WHERE active = 1 AND plannerid = @planner_id
        ORDER BY id DESC
    `;

    try {
        // Pass planner_id as a parameter to the query
        const results = await queryDatabase(query, { planner_id });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
