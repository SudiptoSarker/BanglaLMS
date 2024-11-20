'use client'
// React core imports for managing component state and side effects.
import { useEffect, useState } from "react";

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";

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

import Cookies from 'js-cookie'; 
import { useCookies,CookiesProvider } from "react-cookie";
import { checkSubscription } from "@/helper/helper";
import { siteid } from '@/helper/helper';
import * as CryptoJS from 'crypto-js';

export default function MemberPage() {     
    const router = useRouter(); // Router instance for navigation control.
    const {query} = router; // Extract query parameters from the route.
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ? process.env.NEXT_PUBLIC_SECRET_KEY : 'banglalms';  // Secret key 

    // State variables for managing data and application behavior.
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [licenseKey,setLicenseKey] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);
    
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
    
    // Retrieve the user's license key if they are subscribed.
    const getLicenseKey = async(uidCookie) => {
        setLicenseKey('');
        const result = await checkSubscription(uidCookie);
        const  responseKey = result.licensekey;
        setLicenseKey(responseKey);
    }; 

    // Check subscription status and fetch license key if applicable.
    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        if(susbscribeStatus){
            getLicenseKey(uidCookie);
        }
        setIsSubscribed(susbscribeStatus);
    };

    // Main effect hook for component initialization and handling query/cookie data.
    useEffect(() => {
        // Check authentication cookies.
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/'); // Redirect to the login page if not authenticated.
        }
        getSiteInformation();

        setAuth(authCookie); // Update authentication state.
        let uidparam = query.uid; // Get UID from query parameters.
 
        if(uidparam){
            // Encrypt UID and store in a cookie.
            const encryptedUid = CryptoJS.AES.encrypt(uidparam, secretKey).toString();
            setCookie('muid',encryptedUid);
            subcribeData(uidparam);
        }
        else{
            // Decrypt UID from existing cookie.
            let uidFromCookie = cookies.muid;
            if(uidFromCookie){
                const bytes = CryptoJS.AES.decrypt(uidFromCookie, secretKey);
                const decryptedUid = bytes.toString(CryptoJS.enc.Utf8);
                subcribeData(decryptedUid);
            }
            else{
                setIsSubscribed(false);
            }
        }

    }, [router]);

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout globalData={{}}>  
                {/* Show MemberPageComponent only if authenticated and subscribed to the service */}
                {auth && isSubscribed && (
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
                {(auth && !isSubscribed) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}                       
            </Layout>
        </CookiesProvider>
    );
}
