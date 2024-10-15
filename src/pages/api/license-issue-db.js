import { queryDatabase } from "@/lib/config"; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { siteid, cs, ci, muid, act } = req.query;

    // Check if the required parameters have values
    if (!siteid || !ci || !muid || !act) {
        return res.status(400).json({
            success: false, 
            message: 'Missing required parameters',
            siteid: siteid || null,
            cs: cs || null,
            ci: ci || null,
            muid: muid || null
        });
    }

    try {
        // Query to get the sourcetable from the SiteTable using siteid
        const siteQuery = `SELECT sourcetable FROM SiteTable WHERE id = @siteid AND active = 1`;
        console.log(`Executing site query: ${siteQuery} with params: ${siteid}`);
        
        const siteData = await queryDatabase(siteQuery, { siteid });

        if (siteData && siteData.length > 0) {
            const tableName = siteData[0].sourcetable;

            if (!tableName) {
                return res.status(404).json({
                    success: false,  // Boolean false
                    message: 'Sourcetable not found for the site'
                });
            }

            // Ensure that tableName is safe to use in a query (avoid SQL injection)
            if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid table name'
                });
            }

            // Query the relevant table using the site filter and additional conditions
            const licenseQuery = `
                SELECT licensekey, ci, validity, active 
                FROM ${tableName} 
                WHERE active = 1 
                AND validity >= GETDATE() 
                AND ci = @ci
            `;
            console.log(`Executing license query: ${licenseQuery} with params: ${ci}`);
            
            const licenseData = await queryDatabase(licenseQuery, { ci });

            if (!licenseData || licenseData.length === 0) {
                return res.status(404).json({
                    success: false,  // Boolean false
                    message: 'No valid license found for the provided CI'
                });
            }

            const { licensekey } = licenseData[0];

            // Final response with license key, muid, ci, and success timestamp
            return res.status(200).json({
                success: true,  
                licenseKey: licensekey,
                muid: muid,
                ci: ci,
                cs: cs,
            });

        } else {
            return res.status(404).json({
                success: false,  
                message: 'Site not found or inactive'
            });
        }

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,  
            message: 'Internal server error',
            error: error.message
        });
    }
}
