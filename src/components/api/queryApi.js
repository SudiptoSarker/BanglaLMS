/**
 * Calls a specified API endpoint to execute database queries.
 * @param {string} query - SQL query to execute.
 * @param {Array} values - Array of values for parameterized queries (optional).
 * @returns {Promise<Object>} - The JSON response from the server.
 * @throws {Error} - If there is a network or server error.
 */

const calltoApi = async (query, values) => {
    try {
        const api = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(api+"api/db", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ query, values }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

/**
 * Retrieves site id for specific site.
 * Filters sites by naming convention.
*/
export const getSiteId = async (domain) => {
    const siteIdQuery = `SELECT id FROM [dbo].[sites] WHERE name LIKE '%${domain}'`;
    const siteIdResult =  await calltoApi(siteIdQuery, []);    
    return siteIdResult;    
}

/**
 * Retrieves subscription data for a specific user.
 * Subscription data filters by site primary key, mopita user id and status true.
*/
export const getSubscribedData = async (siteid, muid) => {
    const query = `SELECT * FROM [dbo].[membertable] WHERE siteid='${siteid}' AND muid='${muid}' AND status=1`;
    return await calltoApi(query,[]);
}

/**
 * Retrieves planner's subscription data for page data show
 * Planner's subscription data filter by site primary key and planner's design section name
*/
export const fetchSubscriptionData = async (siteId, sectionname) => {
    try {
        if (!siteId) {
            throw new Error(`Site with name '${sitename}' not found.`);
        }

        // Step 2: Use the site id to fetch the subscription data
        const subscriptionQuery = `SELECT * FROM [dbo].[${siteId}_subscriptiondata] WHERE section = '${sectionname}'`;
        
        const subscriptionResult = await calltoApi(subscriptionQuery,[]);

        // Return the subscription data
        return subscriptionResult;

    } catch (error) {
        console.error('Error fetching subscription data:', error);
        throw error;
    }
};

/**
 * Retrieves planner's login data for authentication on every page
 * Planner's login data filter by site primary key and planner's design section name.
*/
export const fetchLoginData = async (siteId, sectionname) => {
    try {
        if (!siteId) {
            throw new Error(`Site with name '${sitename}' not found.`);
        }

        // Step 2: Use the site id to fetch the subscription data
        const subscriptionQuery = `SELECT * FROM [dbo].[${siteId}_logindata] WHERE section = '${sectionname}'`;
        
        const subscriptionResult = await calltoApi(subscriptionQuery,[]);

        // Return the subscription data
        return subscriptionResult;

    } catch (error) {
        console.error('Error fetching subscription data:', error);
        throw error;
    }
};

/**
 * Retrieves planner's Notifications data to show on the page.
 * Planner's Notifications data filter by site primary key and planner's design section name.
*/
export const fetchNotificationsAndAnnouncements = async (siteId, sectionname) => {
    const query = `SELECT * FROM [dbo].[${siteId}_textlinks] WHERE section = '${sectionname}'`;    
    const values = [];
    return await calltoApi(query,values);
};

/**
 * Retrieves planner's Footer data to show on the page.
 * Planner's Footer data filter by site primary key and planner's design section name.
*/
export const fetchTextLinksForFooterSection = async (siteId, sectionname) => {    
    const query = `SELECT * FROM [dbo].[${siteId}_textlinks]`;//WHERE section LIKE '${sectionname}%'`;    
    const values = [];
    return await calltoApi(query,values);
};