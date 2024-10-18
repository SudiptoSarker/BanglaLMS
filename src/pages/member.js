// Import the Layout component
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import MemberPageComponent from "@/components/site/member/memberpagecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import { useState } from 'react';
import { fetchSubscriptionLoginData, getSiteId,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import Cookies from 'js-cookie'; // Import js-cookie
import { checkSubscription } from "@/helper/helper";

export default function MemberPage({ globalData }) { 
    const [domain, setDomain] = useState("");
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [muid, setMuid] = useState(null); // State to hold 'muid'
    const [licenseKey,setLicenseKey] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        // Get the domain name when the component mounts
        // if (typeof window !== "undefined") {
        //     const currentDomain = window.location.hostname;
        //     setDomain(currentDomain);
        //     console.log("Current domain:", currentDomain); // Debugging
        // }
        setDomain(process.env.NEXT_PUBLIC_DOMAIN);

        // Get 'muid' from cookies        
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
        if (domain) {
            const getSiteInformation = async () => {
                try {
                    const siteIdResult = await getSiteId(domain);
                    if (!siteIdResult) {
                        throw new Error(`Site with name '${domain}' not found.`);
                    }
                    const siteId = siteIdResult.data[0]?.id;
                    console.log("Extracted site ID:", siteId);
                    getSubscriptionData(siteId);
                    getLoginData(siteId);
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

            const getLoginData = async (siteId) => {
                try {
                    const response = await fetchSubscriptionLoginData(siteId, "loginbutton");
                    setLoginData(response.data);
                } catch (error) {
                    console.log("Error fetching login data:", error);
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

            {(globalData.auth && !globalData.isSubscribed) && (
                subscriptionData.map((option, index) => (
                    <SubscriptionButton key={index} data={option} />
                ))
            )}

            {/* Show TopPageComponent if user is authenticated and subscribed */}
            {globalData.auth && globalData.isSubscribed && (
                <MemberPageComponent licenseKey={licenseKey} />  
            )}                        
        </Layout>
    );
}
