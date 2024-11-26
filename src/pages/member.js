'use client'
// React core imports for managing component state and side effects.
import { useEffect, useState } from "react";
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
import { checkSubscription } from "@/helper/helper";
import { siteid,validateUserId } from '@/helper/helper';
import { useRouter } from "next/router";


export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;
    let isMember = false;
    let licenseKey = '';

    let uid = query.uid;
    // Validating User ID
    isLogin = validateUserId(uid);

    if(isLogin){
        const subscriptionData =  await checkSubscription(uid);
        if(subscriptionData != null && subscriptionData != undefined){
            isMember = true;
            licenseKey = subscriptionData.licensekey;
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

    // State variables for managing data and application behavior.
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

    // Main effect hook for component initialization and handling query/cookie data.
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

                {(isLogin && !isMember) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}                       
            </Layout>
        </CookiesProvider>
    );
}
