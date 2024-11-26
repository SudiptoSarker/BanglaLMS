'use client'
import { useEffect, useState } from "react";
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
import { siteid,validateUserId } from '@/helper/helper';
import { checkSubscription } from "@/helper/helper";
import { CookiesProvider } from "react-cookie";
import { useRouter } from "next/router";


export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;
    let isMember = false;

    let uid = query.uid;

    isLogin = validateUserId(uid);
    if(isLogin){
        let subscriptionData =  await checkSubscription(uid);
        if(subscriptionData != null && subscriptionData != undefined){
            isMember = true;
        }
    }
    
    return { props: {
        isLogin: isLogin,
        isMember: isMember
    } };
}

export default function TopPage({isLogin,isMember}) {
    const router = useRouter();

    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);

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

    useEffect(() => {
        if(!isLogin){
            router.push('/');
        }
        getSiteInformation();
    },[router]);

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout>  
                <HeaderComponent  />         
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
                <FeatureSection  />                   
                {(isLogin && !isMember) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}

                {/* Show TopPageComponent if user is authenticated and subscribed */}
                {isLogin && isMember && (
                    <TopPageComponent />
                )}

                <br />
            </Layout>
        </CookiesProvider>
    );
}
