'use client'
// React core imports for managing component state and side effects.
import { useEffect, useState } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Header component
import HeaderComponent from "@/components/site/header/headercomponent";

// Components for notifications and announcements.
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";

// Feature-related components.
import FeatureSection from "@/components/site/feature/featurecomponent";

// Member-related components.
import MemberPageComponent from "@/components/site/member/memberpagecomponent";

// Subscription-related components.
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";

// API utility functions for fetching site-related data.
import { fetchSubscriptionData, fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import { CookiesProvider } from "react-cookie";

// Helper utilities.
import { siteid,validateUserId,isNullOrEmpty,checkSubscriptionByService } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";
import { getSiteInfo,updateLicenseKey,getLicenseList,deactivateLicenseInSourceTable } from "@/components/api/queryApi";

// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let uid = query.uid;
    let ci = query.ci;


    // dev
    //let uid = '015752033990000000';

    let isLogin = false;
    let isMember = false;
    let licenseKey = '';
    let siteId = await siteid();
    
    // Validating User ID
    isLogin = validateUserId(uid);

    //dev
    //isLogin = true;

    if(isLogin){

        if(!isNullOrEmpty(ci)){
            const subscriptionData =  await checkSubscriptionByService(uid,ci);
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
    }

    // Pass the login status as a prop to the component.
    return { props: {
        isLogin: isLogin,
        isMember: isMember,
        licenseKey: licenseKey
    } };
}

export default function MemberPage({isLogin,isMember,licenseKey}) {     
    const router = useRouter(); // Router instance for navigation control.

    // State variables for managing data and application behavior.
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    // Fetch subscription data from the API.
    const getSubscriptionData = async (siteId) => {
        try {
            const response = await fetchSubscriptionData(siteId, "DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Fetch notifications data from the API.
    const getNotifications = async (siteId) => {
        try {
          const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
          setNotifications(data.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
    };

    // Fetch announcements data from the API.
    const getAnnouncements = async (siteId) => {
        try{
          const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
          setAnnouncements(data.data);
        }catch(error) {
          console.error("Error fetching announcements:", error);
        }
    };

    // Retrieve all site information (subscription, notifications, announcements).
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
            <Layout>  
                {/* Show MemberPageComponent only if authenticated and subscribed to the service */}
                {isLogin && isMember && (
                    <MemberPageComponent licenseKey={licenseKey} />  
                )} 

                {/* Header section */}
                <HeaderComponent  />   

                {/* Notification section */}          
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}    

                {/* Announcement section */}                                                
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))}

                {/* Feature section */}        
                <FeatureSection  />     

                {/* Show subscription buttons if authenticated but not subscribed to the service */}
                {(isLogin && !isMember) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}                                       
            </Layout>
        </CookiesProvider>
    );
}
