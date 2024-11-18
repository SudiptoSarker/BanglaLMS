import { useState,useEffect } from 'react';
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import { fetchLoginData,fetchSubscriptionData,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';
import { CookiesProvider } from "react-cookie";
import { checkSubscription } from "@/helper/helper";

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

export default function HomePage({ isLogin, isMember}) {   

    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);

    const getSubscriptionData = async (siteId) => {                
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    const getLoginData = async (siteId) => {
        try {            
            const response = await fetchLoginData(siteId,"LoginSection");
            setLoginData(response.data);
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
            getLoginData(siteId);     
            getNotifications(siteId);
            getAnnouncements(siteId);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };


    useEffect(() => {
        getSiteInformation();
    }, []); 

      
    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout globalData={{}}>  
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
                <SubscriptionInfo  />                       

                {/* Show SubscriptionButton if auth is false or if auth is true but not subscribed */}
                {(!isLogin || (isLogin && !isMember)) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}

                {/* Show TopPageComponent if user is authenticated and subscribed */}
                {isLogin && isMember && (
                    <TopPageComponent />
                )}

                {/* Show LoginButton if user is not authenticated */}
                {!isLogin && (
                    loginData.map((option, index) => (
                        <LoginButton key={index} data={option} />
                    ))
                )}
            </Layout>
        </CookiesProvider>
    );
}
