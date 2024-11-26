import { getSiteId, getSubscribedData } from "@/components/api/queryApi"

/**
 * Fetches the site ID based on the domain.
 * 
 * @returns {string|null} - The site ID or null if not found.
 */
export const siteid = async() => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const siteIdResult = await getSiteId(domain);
    const id = siteIdResult.data[0]?.id;
    return id;
}

/**
 * Checks the subscription status of a user based on the site ID and user ID.
 * 
 * @param {string} uid - The user ID to check the subscription for.
 * @returns {object|null} - The subscription data or null if not subscribed.
 */
export const checkSubscription = async(uid) => {
    const site = await siteid();
    const subscribeResult = await getSubscribedData(site, uid);
    const subscribeData = subscribeResult.data[0] || null;
    return subscribeData;
}

export const validateUserId = (uid) => {
    // Check : NULLGWDOCOMO, _blank, undefined
    if(!uid || uid == '' || uid == 'NULLGWDOCOMO'){
        return false;
    }
    // Check : 18 characters for UID
    return uid.length == 18;
    
}