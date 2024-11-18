import { getSiteId, getSubscribedData } from "@/components/api/queryApi"

export const siteid = async() => {
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const siteIdResult = await getSiteId(domain);
    const id = siteIdResult.data[0]?.id;
    return id;
}

export const checkSubscription = async(uid) => {
    const site = await siteid();
    const subscribeResult = await getSubscribedData(site, uid);
    const subscribeData = subscribeResult.data[0] || null;
    return subscribeData;
}

export const validateUserId = (uid) => {

    if(!uid || uid == '' || uid == 'NULLGWDOCOMO'){
        return false;
    }

    return uid.length == 18;
    
}