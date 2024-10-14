import { queryDatabase } from '@/lib/config';

export default async function handler(req, res) {
  const { sitePK } = req.query; // Get site primary key from query param

  if (!sitePK) {
    return res.status(400).json({ message: "Site primary key is required." });
  }

  try {
    // Step 1: Fetch the sourcetable from SiteTable
    const sourceTableQuery = `SELECT sourcetable FROM SiteTable WHERE id = '${sitePK}'`;
    const sourceTableResult = await queryDatabase(sourceTableQuery);

    if (!sourceTableResult || sourceTableResult.length === 0) {
      return res.status(404).json({ message: "Site not found." });
    }

    const { sourcetable } = sourceTableResult[0]; // Extract sourcetable value

    // Step 2: Query to fetch all tables starting with sitePK_
    const tableQuery = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '${sitePK}_%'`;
    const tables = await queryDatabase(tableQuery);

    // Step 3: Check if the TABLE_NAME matches the sourcetable and add isdelete column
    const result = tables.map(table => {
      const isdelete = table.TABLE_NAME === `${sitePK}_${sourcetable}` ? false : true;
      return {
        TABLE_NAME: table.TABLE_NAME,
        isdelete,
      };
    });

    // Step 4: Return the result
    res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching site tables or sourcetable:', error);
    res.status(500).json({ message: 'Failed to fetch site tables.' });
  }
}
