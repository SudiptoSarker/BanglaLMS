import { getSiteId, getSubscribedData } from "@/components/api/queryApi"

export const siteid = async() => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const siteIdResult = await getSiteId(domain);
    const id = siteIdResult.data[0]?.id;
    return id;
}

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