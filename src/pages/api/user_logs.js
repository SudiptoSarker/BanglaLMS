import { queryDatabase } from '@/lib/config';
export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const query = `
      SELECT id, muid, pagelink, activity, CONVERT(VARCHAR, time, 120) AS activityTime
      FROM [dbo].[userlogs]
      ORDER BY id DESC
    `;
  
    try {
      const results = await queryDatabase(query);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  