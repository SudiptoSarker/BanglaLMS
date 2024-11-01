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
import * as CryptoJS from 'crypto-js';

export default function MemberPage() {     
    const router = useRouter();
    const {query} = router;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ? process.env.NEXT_PUBLIC_SECRET_KEY : 'banglalms';

    const [subscriptionData, setSubscriptionData] = useState([]);
    const [licenseKey,setLicenseKey] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [cookies, setCookie] = useCookies(['muid']);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [auth, setAuth] = useState(false);
    

   

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
    
    const getLicenseKey = async(uidCookie) => {
        setLicenseKey('');
        const result = await checkSubscription(uidCookie);
        const  responseKey = result.licensekey;
        setLicenseKey(responseKey);
    }; 


    const subcribeData = async(uidCookie) => {
        const result = await checkSubscription(uidCookie);
        const  susbscribeStatus = result ? true : false;
        if(susbscribeStatus){
            getLicenseKey(uidCookie);
        }
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
