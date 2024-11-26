'use client'
import { useEffect, useState } from "react";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import MemberPageComponent from "@/components/site/member/memberpagecomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import { fetchSubscriptionData, fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import { CookiesProvider } from "react-cookie";
import { checkSubscription } from "@/helper/helper";
import { siteid,validateUserId } from '@/helper/helper';
import { useRouter } from "next/router";
import { getSiteInfo,updateLicenseKey,getLicenseList,deactivateLicenseInSourceTable } from "@/components/api/queryApi";


export async function getServerSideProps(context) {
    const {query} = context;
    let uid = query.uid;

    // dev
    //let uid = '01575203399';

    let isLogin = false;
    let isMember = false;
    let licenseKey = '';
    let siteId = await siteid();
    
    // Validating User ID
    isLogin = validateUserId(uid);

    //dev
    //isLogin = true;

    if(isLogin){
        const subscriptionData =  await checkSubscription(uid);
        if(subscriptionData != null && subscriptionData != undefined){
            isMember = true;
            if(subscriptionData.licensekey != null){
                licenseKey = subscriptionData.licensekey;
            }
            else{
                try{
                    let siteDataList = await getSiteInfo(siteId);
                    let siteData = siteDataList.data[0];
    
                    if(siteData.source.toLowerCase() == 'webapi'){
                        
                        let _url = siteData.reglink;
                        
    
                        _url = _url.replace('{cs}',subscriptionData.cs);
                        _url = _url.replace('{ci}',subscriptionData.ci);
                        _url = _url.replace('{uid}',uid);
                        _url = _url.replace('{act}','reg');
    
                        let queryString = _url.substring(_url.indexOf('?')+1,_url.length);
    
                        const response = await fetch(_url, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            query: queryString
                        });
    
                        let result = await response.json();
                        if(result.success){
                            let updateResult = await updateLicenseKey(subscriptionData.Id,result.key,result.validity);
                            if(updateResult.data[0].affectedRow){
                                licenseKey = result.key;
                            }
                        }
                    }
                    else{
                        let licenseData = await getLicenseList(siteId,subscriptionData.ci);
                        if(licenseData.data.length > 0){
                            let _validity = new Date(licenseData.data[0].validity).toISOString().split('T')[0];
                            
                            let updateResult = await updateLicenseKey(subscriptionData.Id,licenseData.data[0].licensekey,_validity);

                            if(updateResult.data[0].affectedRow > 0){
                                let deactivateResult = await deactivateLicenseInSourceTable(licenseData.data[0].id,siteId);
                                licenseKey = licenseData.data[0].licensekey;
                            }
                        }
                    }
                }
                catch(error){
                    console.log(error);
                    licenseKey = 'You have already subscribed, but license key is unavailable right now. Please try again later.';
                }
               

            }
            
        }

    }

    return { props: {
        isLogin: isLogin,
        isMember: isMember,
        licenseKey: licenseKey
    } };
}

export default function MemberPage({isLogin,isMember,licenseKey}) {    
 
    const router = useRouter();

    const [subscriptionData, setSubscriptionData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);


    const getSubscriptionData = async (siteId) => {
        try {
            const response = await fetchSubscriptionData(siteId, "DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    const getNotifications = async (siteId) => {
        try {
          const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
          setNotifications(data.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
    };

    const getAnnouncements = async (siteId) => {
        try{
          const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
          setAnnouncements(data.data);
        }catch(error) {
          console.error("Error fetching announcements:", error);
        }
    };

    const getSiteInformation = async () => {
        try {
            const siteId = await siteid();

            getSubscriptionData(siteId);
            getNotifications(siteId);
            getAnnouncements(siteId);
        } catch (error) {
            console.log("Error fetching site information:", error);
        }
    };

    useEffect(() => {
        if(!isLogin){
            router.push('/');
        }
        if(!isMember){
            router.push('/top');
        }
        getSiteInformation();
    }, [router]);

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout globalData={{}}>  
                {isLogin && isMember && (
                    <MemberPageComponent licenseKey={licenseKey} />  
                )}
                <HeaderComponent  /> 

                {/* Show TopPageComponent if user is authenticated and subscribed */}                         
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}                                    
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))}
                <FeatureSection  />     

                {(isLogin && !isMember) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}                       
            </Layout>
        </CookiesProvider>
    );
}
