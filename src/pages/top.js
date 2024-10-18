// Import the Layout component
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import { fetchSubscriptionLoginData,getSiteId,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";

export default function TopPage({ globalData }) {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [domain, setDomain] = useState("");
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);

//    useEffect(() => {
   // Get the domain name when the component mounts
//    if (typeof window !== "undefined") {
//        const currentDomain = window.location.hostname;
//        setDomain(currentDomain);
//        console.log("Current domain:", currentDomain); // For debugging
//    }
//    }, []); // This useEffect runs only once, when the component mounts
    
   useEffect(() => {
    setDomain(process.env.NEXT_PUBLIC_DOMAIN);
   // Fetch subscription data once the domain is set
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
            {(globalData.auth && !globalData.isSubscribed) && (
                subscriptionData.map((option, index) => (
                    <SubscriptionButton key={index} data={option} />
                ))
            )}

            {/* Show TopPageComponent if user is authenticated and subscribed */}
            {globalData.auth && globalData.isSubscribed && (
                <TopPageComponent />
            )}

            <br />
        </Layout>
    );
}
