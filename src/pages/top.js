'use client'
import { useEffect, useState } from "react";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
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

    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
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
