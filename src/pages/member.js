'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import MemberPageComponent from "@/components/site/member/memberpagecomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import { fetchSubscriptionLoginData, getSiteId,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import Cookies from 'js-cookie'; 
import { useCookies,CookiesProvider } from "react-cookie";
import { checkSubscription } from "@/helper/helper";
import { siteid } from '@/helper/helper';

export default function MemberPage({ globalData }) {     
    const router = useRouter();
    const {query} = router;
    
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [licenseKey,setLicenseKey] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);
    

    useEffect(() => {                        
        const uidCookie = Cookies.get('muid') || null;       
        if (uidCookie){
            console.log('uidCookie: ',uidCookie);
            const getLicenseKey = async(uidCookie) => {
                const result = await checkSubscription(uidCookie);

                const  responseKey = result.licensekey;
                setLicenseKey(responseKey);
            };   
            
            getLicenseKey(uidCookie);
        }
    }, []);

    useEffect(() => {
        getSiteInformation();
    }, []);
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

    const getSubscriptionData = async (siteId) => {
        try {
            const response = await fetchSubscriptionLoginData(siteId, "DeviceSubscriptionButton");
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

                {(auth && !isSubscribed) && (
                    subscriptionData.map((option, index) => (
                        <SubscriptionButton key={index} data={option} />
                    ))
                )}

                {/* Show TopPageComponent if user is authenticated and subscribed */}
                {auth && isSubscribed && (
                    <MemberPageComponent licenseKey={licenseKey} />  
                )}                        
            </Layout>
        </CookiesProvider>
    );
}
