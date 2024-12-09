import { getSiteId, getSubscribedData,getSubscribedDataByService } from "@/components/api/queryApi"

/**
 * Fetches the site ID based on the domain.
 * 
 * @returns {string|null} - The site ID or null if not found.
 */
export const siteid = async() => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    try{
        const siteIdResult = await getSiteId(domain);
        const id = siteIdResult.data[0]?.id;
        return id;
    }
    catch(error){
        return null;
    }
}

/**
 * Checks the subscription status of a user based on the site ID and user ID.
 * 
 * @param {string} uid - The user ID to check the subscription for.
 * @returns {object|null} - The subscription data or null if not subscribed.
 */
export const checkSubscription = async(uid) => {
    try{
        const site = await siteid();
        const subscribeResult = await getSubscribedData(site, uid);
        const subscribeData = subscribeResult.data[0] || null;
        return subscribeData;
    }
    catch(error){
        return null;
    }

}

export const checkSubscriptionByService = async(uid,ci) => {
    try{
        const site = await siteid();
        const subscribeResult = await getSubscribedDataByService(site, uid,ci);
        const subscribeData = subscribeResult.data[0] || null;
        return subscribeData;
    }
    catch(error){
        return null;
    }

}

//mopita user id validation
export const validateUserId = (uid) => {
    // Check : NULLGWDOCOMO, _blank, undefined
    if(!uid || uid == '' || uid == 'NULLGWDOCOMO'){
        return false;
    }
    // Check : 18 characters for UID
    return uid.length == 18;
    
}

export function isNullOrEmpty(value) {
    return value === null || value === undefined || value === '';
}