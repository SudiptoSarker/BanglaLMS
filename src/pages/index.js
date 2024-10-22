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
import { fetchSubscriptionLoginData,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';

export default function HomePage({ globalData }) {    
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
        
    const domain = process.env.NEXT_PUBLIC_DOMAIN;

    useEffect(() => {        
        if (domain) {
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
            
            const getSubscriptionData = async (siteId) => {                
            try {            
                const response = await fetchSubscriptionLoginData(siteId,"DeviceSubscriptionButton");
                setSubscriptionData(response.data);
            } catch (error) {
                console.log("Error fetching subscription data:", error);
            }
            };
            const getLoginData = async (siteId) => {
                try {            
                    const response = await fetchSubscriptionLoginData(siteId,"loginbutton");
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
        
            getSiteInformation();
        }
    }, [domain]);  

      
    return (
        <Layout globalData={globalData}>  
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
            {(!globalData.auth || (globalData.auth && !globalData.isSubscribed)) && (
                subscriptionData.map((option, index) => (
                    <SubscriptionButton key={index} data={option} />
                ))
            )}

            {/* Show TopPageComponent if user is authenticated and subscribed */}
            {globalData.auth && globalData.isSubscribed && (
                <TopPageComponent />
            )}

            {/* Show LoginButton if user is not authenticated */}
            {!globalData.auth && (
                loginData.map((option, index) => (
                    <LoginButton key={index} data={option} />
                ))
            )}
        </Layout>

    );
}
