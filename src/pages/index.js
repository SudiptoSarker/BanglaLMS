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
import { useRouter } from "next/router";
import { useCookies,CookiesProvider } from "react-cookie";
import Cookies from 'js-cookie'; 
import { checkSubscription } from "@/helper/helper";
import * as CryptoJS from 'crypto-js';

export default function HomePage() {    
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);

    const router = useRouter();
    const {query} = router;

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ? process.env.NEXT_PUBLIC_SECRET_KEY : 'banglalms';

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

    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        setIsSubscribed(susbscribeStatus);
      };

    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        getSiteInformation();

        setAuth(authCookie);
        let uidparam = query.uid;

        if(uidparam){
            const encryptedUid = CryptoJS.AES.encrypt(uidparam, secretKey).toString();
            setCookie('muid',encryptedUid);
            subcribeData(uidparam);
            
        }
        else{
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
