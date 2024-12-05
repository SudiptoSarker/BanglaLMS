//Demo body components are being called. 
import { useState,useEffect } from 'react';

import Layout from '@/components/lmstest/layout/layout';

import { NotificationComponent } from '@/components/lmstest/notificationcomponent/notifications';
import BodyComponent from '@/components/lmstest/bodycomponent/bodycomponent';
import SubscriptionButton from '@/components/lmstest/subscriptioncomponent/subscribebutton';
import LoginButton from '@/components/lmstest/loginbutton/loginbuttoncomponent';

import { fetchNotifications,getMemberResourceCatByUid,fetchSubscriptions,fetchLoginData } from "@/components/api/queryApi";
import { siteid,validateUserId,checkSubscription } from '@/helper/helper';

import { CookiesProvider } from "react-cookie";

// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;
    let isMember = false;
    let _skippableCategories = [];
    let _skippableResources = [];

    let siteId = await siteid();

    // Extract user ID (uid) from the query parameters.
     let uid = query.uid;
    // dev
    // uid = '279d0664343d1bba04';

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
    
    // Pass the login status as a prop to the component.
    return { props: {
        isLogin: isLogin,
        isMember: isMember,
        skippableCategories:_skippableCategories,
        skippableResources:_skippableResources
    } };
}

export default function HomePage({ isLogin, isMember,skippableCategories,skippableResources}) {       
    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);

    // Function to fetch notification data for the site
    const getNotifications = async (siteId) => {
        try {
            const data = await fetchNotifications(siteId,"NotificationLink");                  
            setNotifications(data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    
    // Function to fetch subscription data for the site.
    const getSubscriptionData = async (siteId) => {                
        try {            
            const response = await fetchSubscriptions(siteId,"Button");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Function to fetch login section data for the site.
    const getLoginData = async (siteId) => {
        try {            
            const response = await fetchLoginData(siteId,"LoginForm");
            setLoginData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    // Main function to fetch all site-related data.
    const getSiteInformation = async () => {
        try {
            // const siteId = await siteid();     
                                    
            getSubscriptionData(59);              
            getLoginData(59);     
            getNotifications(59);
            // getAnnouncements(siteId);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    useEffect(() => {
        getSiteInformation();
    }, []); 

    console.log('loginData: ',loginData);
    // Main render function for the landing page.
    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout>  
               

                {/* Render notification components */}              
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}   
                <br />
                <BodyComponent  />                               

                {/* Show SubscriptionButton if auth is false or if auth is true but not subscribed */}
                {
                    subscriptionData.map((option, index) => {
                        // if(!skippableCategories.includes(option.category)){
                        //     return <SubscriptionButton key={index} data={option} />
                        // }
                        return <SubscriptionButton key={index} data={option} />
                    })
                }

                {/* Show LoginButton if user is not authenticated */}
                {/* {!isLogin && (
                    loginData.map((option, index) => (
                        <LoginButton key={index} data={option} />
                    ))
                )} */}                
                {loginData.map((option, index) => (
                    <LoginButton key={index} data={option} />
                ))}
            </Layout>
        </CookiesProvider>
    );
}
