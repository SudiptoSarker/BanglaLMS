import { fetchLoginData, fetchNotificationsAndAnnouncements, fetchSubscriptionData, getMemberResourceCatByUid } from "@/components/api/queryApi";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import HeaderComponent from "@/components/site/header/headercomponent";
import Layout from "@/components/site/layout/layout";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import { checkSubscription, validateUserId } from "@/helper/helper";
import { useEffect, useState } from "react";

export async function  getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;
    let isMember = false;
    let _skippableCategories = [];
    let _skippableResources = [];

    // Extract user ID (uid) from the query parameters.
    let uid = query.uid;

    // Validate the user ID: null check,char length check, empty check.
    isLogin = validateUserId(uid);

    //If logged in,get the subscription data to check isMember or not. 
    if(isLogin){
        let subscriptionData =  await checkSubscription(uid);
        if(subscriptionData != null && subscriptionData != undefined){
            isMember = true;
            let _memberList = await getMemberResourceCatByUid(uid,siteId);
            if(_memberList.data.length > 0){
                _skippableCategories = _memberList.data.map(x=>x.category);
                _skippableResources = _memberList.data.map(x=>{return {ci:x.ci, servicename:x.servicename}});
            }
        }
    }

    return {
        props: {
            isLogin: isLogin,
            isMember: isMember,
            skippableCategories: _skippableCategories,
            skippableResources: _skippableResources,
            userId: uid || null
        }
    }
}

export default function ApiTestPage({ isLogin, isMember,skippableCategories,skippableResources,userId}) {   
    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [paymentList, setPaymentList] = useState([]);

    // Function to fetch subscription data for the site.
    const getSubscriptionData = async (siteId) => {                
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch login section data for the site.
    const getLoginData = async (siteId) => {
        try {            
            const response = await fetchLoginData(siteId,"LoginSection");
            setLoginData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch notification data for the site
    const getNotifications = async (siteId) => {
        try {
            const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
            setNotifications(data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Function to fetch announcement data for the site.
    const getAnnouncements = async (siteId) => {
    try{
        const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
        setAnnouncements(data.data);
    }catch(error) {
        console.error("Error fetching announcements:", error);
    }
    };

    // Main function to fetch all site-related data.
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

    const handleBeforePurchaseApi = async (serviceID, serviceType, payType) => {
        try {
            const response = await fetch(`/api/mopita-before-pay-api?serviceID=${serviceID}&serviceType=${serviceType}&payType=${payType}`);
            let result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePurchaseButton = async (serviceID, uid) => {
        const response = await fetch(`/api/mopita-paylist-api?serviceID=${serviceID}&userID=${uid}`);
        let result = await response.json();
        setPaymentList(result.result.paytypelist);
    };


    useEffect(() => {
        getSiteInformation();
    }, []); 

    // Main render function for the landing page.
    return (
        <Layout>  
            <HeaderComponent  />                     

            {/* Render notification components */}              
            {notifications.map((notification, index) => (
                <NotificationComponent
                key={index}
                text={notification.text}
                href={notification.link}
                />
            ))}     

            {/* Render announcement components */}                                            
            {announcements.map((announcement, index) => (
                <AnnounceComponent 
                    key={index}
                    {...announcement}          
                />
            ))}

            {/* Render feature section */}
            <FeatureSection  />

            {/* Render subscription information */}
            <SubscriptionInfo  />                       

            {!isLogin && (
                <button onClick={handlePurchaseButton('R000002769', uid)}>Bangla License Management System Option: 220 yen per month (tax included)</button>
            )}
        </Layout>
    );
}