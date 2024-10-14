import { queryDatabase } from "@/lib/config";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { plannerid, password } = req.body;

    if (!plannerid || !password) {
        return res.status(400).json({
            planneridError: !plannerid,
            passwordError: !password,
            error: 'Invalid Planner ID or Password'
        });
    }

    const checkPlannerQuery = `
      SELECT 
        COUNT(*) AS count 
      FROM [dbo].[planners] 
      WHERE plannerid = '${plannerid}' 
      AND active = 1`;

    try {
        const result = await queryDatabase(checkPlannerQuery);
        const matchExists = result[0].count === 1;

        if (matchExists) {
            // Check password separately
            const checkPasswordQuery = `
              SELECT 
                COUNT(*) AS count 
              FROM [dbo].[planners] 
              WHERE plannerid = '${plannerid}' 
              AND password = '${password}' 
              AND active = 1`;

            const passwordResult = await queryDatabase(checkPasswordQuery);
            const passwordMatch = passwordResult[0].count === 1;

            if (passwordMatch) {
                return res.status(200).json({ matchExists });
            } else {
                return res.status(400).json({
                    planneridError: false, // No error for planner ID
                    passwordError: true,   // Error for password
                    error: 'Invalid Password'
                });
            }
        } else {
            // If planner ID does not match, check if the password matches with any active planner
            const passwordResult = await queryDatabase(`
              SELECT COUNT(*) AS count 
              FROM [dbo].[planners] 
              WHERE password = '${password}' 
              AND active = 1`);

            const passwordMatch = passwordResult[0].count === 1;

            if (passwordMatch) {
                // If password matches but planner ID does not
                return res.status(400).json({
                    planneridError: true,   // Error for planner ID
                    passwordError: false,   // No error for password
                    error: 'Invalid Planner ID'
                });
            } else {
                // Both planner ID and password do not match
                return res.status(400).json({
                    planneridError: true,   // Error for planner ID
                    passwordError: true,     // Error for password
                    error: 'Invalid Planner ID or Password'
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
