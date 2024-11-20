// React core imports for managing component state and side effects.
import { useState,useEffect } from 'react';

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Header component
import HeaderComponent from "@/components/site/header/headercomponent";

// Components for notifications and announcements.
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";

// Feature-related components.
import FeatureSection from "@/components/site/feature/featurecomponent";

// Subscription-related components.
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";

// Login and top-page components.
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";

// API utility functions for fetching site-related data.
import { fetchLoginData,fetchSubscriptionData,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";

// Helper utilities.
import { siteid,checkSubscription } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";
import { useCookies,CookiesProvider } from "react-cookie";
import Cookies from 'js-cookie'; 
import * as CryptoJS from 'crypto-js';


export default function HomePage() {    
    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);

    const router = useRouter();
    const {query} = router;

    // Secret key for encryption, with a default value.
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ? process.env.NEXT_PUBLIC_SECRET_KEY : 'banglalms';

    // Function to fetch subscription data for the site.
    const getSubscriptionData = async (siteId) => {                
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch login section data for the site.
    const getLoginData = async (siteId) => {
        try {            
            const response = await fetchLoginData(siteId,"LoginSection");
            setLoginData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch notification data for the site
    const getNotifications = async (siteId) => {
        try {
            const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
            setNotifications(data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Function to fetch announcement data for the site.
    const getAnnouncements = async (siteId) => {
    try{
        const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
        setAnnouncements(data.data);
    }catch(error) {
        console.error("Error fetching announcements:", error);
    }
    };

    // Main function to fetch all site-related data.
    const getSiteInformation = async () => {
        try {
            const siteId = await siteid();     
                                    
            getSubscriptionData(siteId);       
            getLoginData(siteId);     
            getNotifications(siteId);
            getAnnouncements(siteId);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to check if the user is subscribed based on their UID.
    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        setIsSubscribed(susbscribeStatus);
    };

    // Effect to initialize data fetching and handle user authentication/subscription state.
    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;

        // Fetch site data.
        getSiteInformation();

        // Set authentication state based on cookies.
        setAuth(authCookie);

        // Handle UID parameter and cookies for subscription status
        let uidparam = query.uid;
        if(uidparam){
            // Encrypt UID and store it in cookies.
            const encryptedUid = CryptoJS.AES.encrypt(uidparam, secretKey).toString();
            setCookie('muid',encryptedUid);
            subcribeData(uidparam);
            
        }
        else{
            // Handle UID from cookies if available.
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

    // Main render function for the landing page.
    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout globalData={{}}>  
                <HeaderComponent  />       

                {/* Render notification components */}              
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}           

                {/* Render announcement components */}                         
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))}

                {/* Render feature section */}
                <FeatureSection  />

                {/* Render subscription information */}
                <SubscriptionInfo  />                       

                {/* Show SubscriptionButton if auth is false or if auth is true but not subscribed */}
                {(!auth || (auth && !isSubscribed)) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}

                {/* Show TopPageComponent if user is authenticated and subscribed */}
                {auth && isSubscribed && (
                    <TopPageComponent />
                )}

                {/* Show LoginButton if user is not authenticated */}
                {!auth && (
                    loginData.map((option, index) => (
                        <LoginButton key={index} data={option} />
                    ))
                )}
            </Layout>
        </CookiesProvider>
    );
}
