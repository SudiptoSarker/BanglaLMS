import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import { fetchSubscriptionLoginData,fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';
import { checkSubscription } from "@/helper/helper";
import Cookies from 'js-cookie'; 
import { useCookies,CookiesProvider } from "react-cookie";

export default function TopPage() {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);


    const router = useRouter();
    const {query} = router;

    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionLoginData(siteId,"DeviceSubscriptionButton");
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

    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        setIsSubscribed(susbscribeStatus);
      };


    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/');
        }

        getSiteInformation();

        setAuth(authCookie);

        let uidparam = query.uid;

        if(uidparam){
            setCookie('muid',uidparam);
            subcribeData(uidparam);
        }
        else{
            let uidFromCookie = cookies.muid;
            if(uidFromCookie){
                subcribeData(uidFromCookie);
            }
            else{
                setIsSubscribed(false);
            }
        }

    }, [router]);


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
                    <TopPageComponent />
                )}

                <br />
            </Layout>
        </CookiesProvider>
    );
}
