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

// Feature-related component.
import FeatureSection from "@/components/site/feature/featurecomponent";

// Top page component.
import TopPageComponent from "@/components/site/top/toppagecomponent";

// Subscription-related component.
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";

// API utility functions for fetching site-related data.
import { fetchSubscriptionData,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";

// Helper utilities.
import { siteid,checkSubscription } from '@/helper/helper';

import Cookies from 'js-cookie'; 
import { useCookies,CookiesProvider } from "react-cookie";
import * as CryptoJS from 'crypto-js';

export default function TopPage() {
    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);


    const router = useRouter();
    const {query} = router;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ? process.env.NEXT_PUBLIC_SECRET_KEY : 'banglalms';

    // Function to fetch subscription data for a specific site ID.
    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch notifications for a specific site ID.
    const getNotifications = async (siteId) => {
         try {
           const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
           setNotifications(data.data);
         } catch (error) {
           console.error("Error fetching notifications:", error);
         }
    };
    
    // Function to fetch announcements for a specific site ID.
    const getAnnouncements = async (siteId) => {
         try{
           const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
           setAnnouncements(data.data);
         }catch(error) {
           console.error("Error fetching announcements:", error);
         }
    };

    // Function to fetch all site-related information (subscription, notifications, announcements).
    const getSiteInformation = async () => {
        try {
             const siteId = await siteid();   

             getSubscriptionData(siteId);       
             getNotifications(siteId);
             getAnnouncements(siteId);        
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to check if the user is subscribed based on their UID cookie.
    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        setIsSubscribed(susbscribeStatus);
      };


    // Effect hook to handle initial page setup.
    useEffect(() => {
        // Check if user is authenticated via cookies.
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/'); // Redirect unauthenticated users to the login page.
        }

        // Fetch site information (subscription, notifications, announcements).
        getSiteInformation();

        // Update the authentication state.
        setAuth(authCookie);

        let uidparam = query.uid;

        if(uidparam){
            // Encrypt UID from query and set it as a cookie.
            const encryptedUid = CryptoJS.AES.encrypt(uidparam, secretKey).toString();
            setCookie('muid',encryptedUid);
            subcribeData(uidparam);
        }
        else{
            // If no UID in query, decrypt it from cookies (if available).
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
                {/* Header component for the top of the page. */}
                <HeaderComponent  /> 

                {/* Render notification components based on fetched notifications. */}        
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}      

                {/* Render announcement components based on fetched announcements. */}                              
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))}  

                {/* Render feature section. */} 
                <FeatureSection  />    

                {/* Display subscription options if user is authenticated but not subscribed. */}               
                {(auth && !isSubscribed) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}

                {/* Display TopPageComponent if user is authenticated and subscribed. */}
                {auth && isSubscribed && (
                    <TopPageComponent />
                )}

                <br />
            </Layout>
        </CookiesProvider>
    );
}
