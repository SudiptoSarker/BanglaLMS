// React core imports for managing component state and side effects.
import { useEffect, useState } from "react";

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Header component
import HeaderComponent from "@/components/site/header/headercomponent";

// Components for notifications and announcements.
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";

// Feature-related component.
import FeatureSection from "@/components/site/feature/featurecomponent";

// Top page component.
import TopPageComponent from "@/components/site/top/toppagecomponent";

// Subscription-related component.
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";

// API utility functions for fetching site-related data.
import { fetchSubscriptionData,fetchNotificationsAndAnnouncements,getMemberListByUid } from "@/components/api/queryApi";

// Helper utilities.
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
    //let uid = '015752033990000000';

    // Validate the user ID: null check,char length check, empty check.
    isLogin = validateUserId(uid);

    //If logged in,get the subscription data to check isMember or not. 
    if(isLogin){
        let subscriptionData =  await checkSubscription(uid);
        if(subscriptionData != null && subscriptionData != undefined){
            isMember = true;
            let _memberList = await getMemberListByUid(uid,siteId);
            if(_memberList.data.length > 0){
                
                _skippableCategories = _memberList.data.map(x=>x.category);
                _skippableResources = _memberList.data.map(x=>x.ci);
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

export default function TopPage({isLogin,isMember,skippableCategories,skippableResources}) {
    const router = useRouter(); // Router instance for navigation control.

    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);

    // Function to fetch subscription data for a specific site ID.
    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionData(siteId,"DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Function to fetch notifications for a specific site ID.
    const getNotifications = async (siteId) => {
         try {
           const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
           setNotifications(data.data);
         } catch (error) {
           console.error("Error fetching notifications:", error);
         }
    };
    
    // Function to fetch announcements for a specific site ID.
    const getAnnouncements = async (siteId) => {
         try{
           const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
           setAnnouncements(data.data);
         }catch(error) {
           console.error("Error fetching announcements:", error);
         }
    };

    // Function to fetch all site-related information (subscription, notifications, announcements).
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

    // Effect hook to handle initial page setup.
    useEffect(() => {
        // If user is not logged in, redirect the user to the login page.
        if(!isLogin){
            router.push('/');
        }
        // Call function to fetch site-related information.
        getSiteInformation();
    },[router]);

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout>  
                {/* Header component for the top of the page. */}
                <HeaderComponent  />  

                {/* Render notification components based on fetched notifications. */}               
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}     

                {/* Render announcement components based on fetched announcements. */}                                            
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))} 

                {/* Render feature section. */}   
                <FeatureSection  />     

                {/* Display subscription options if user is authenticated but not subscribed. */}                        
                {(isLogin) && (
                    subscriptionData.map((option, index) => {
                        if(!skippableCategories.includes(option.category)){
                            return <SubscriptionButton key={index} data={option} />
                        }
                    })
                )}

                {/* Display TopPageComponent if user is authenticated and subscribed. */}
                {isLogin && isMember && (
                    <>
                        <div style={{textAlign:'center'}}>
                            <h2>BDGuardメンバーシップページへ</h2>
                            <p style={{fontSize:'16px',marginTop:'30px'}}>
                            ライセンスキーの確認とアプリのダウンロードは、下記の「会員ページ」から行ってください。
                            </p>
                        </div>
                        {skippableResources.map((item,index)=><TopPageComponent ci={item}/>)}
                    </>  
                )}

                <br />
            </Layout>
        </CookiesProvider>
    );
}
