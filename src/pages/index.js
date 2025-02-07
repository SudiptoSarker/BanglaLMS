// React core imports for managing component state and side effects.
import { useState,useEffect } from 'react';

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Header component
import HeaderComponent from "@/components/site/header/headercomponent";

// Components for notifications and announcements.
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";

// Feature-related components.
import FeatureSection from "@/components/site/feature/featurecomponent";

// Subscription-related components.
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import ShortcutSubscription from "@/components/site/shortcut/subscription/shortcutsubscription";

// Login components.
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import ShortcutLogin from '@/components/site/shortcut/login/shortcutlogincomponent';

// Logout components.
import LogoutButton from '@/components/site/logoutbutton/logoutbuttoncomponent';

// Top-page components.
import TopPageComponent from "@/components/site/top/toppagecomponent";

// API utility functions for fetching site-related data.
import { fetchLoginData,fetchSubscriptionData,fetchNotificationsAndAnnouncements,getMemberResourceCatByUid,getSiteInfo } from "@/components/api/queryApi";

// Helper utilities.
import { siteid,validateUserId,checkSubscription } from '@/helper/helper';
import Cookies from 'js-cookie';
// import styles from './loginbutton.module.css';

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
     let logincat = query.logincat || null;
    // dev
    // uid = '279d0664343d1bba04';
    uid = 'a0565c5d4697e8b1b9';

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
        userId: uid || null,
        isLogin: isLogin,
        logincat: logincat,
        isMember: isMember,
        skippableCategories:_skippableCategories,
        skippableResources:_skippableResources
    } };
}

export default function HomePage({ userId,isLogin, logincat, isMember,skippableCategories,skippableResources}) {   
    // State variables to store various data sets.
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [isProduction,setIsProduction] =useState(true);
    const [isMopita,setIsMopita] =useState(true);

    let loginCatCookieData = Cookies.get('logincat') || null;
    if(logincat){
        Cookies.set('logincat', logincat, { expires: 7, sameSite: 'strict' });
    }else{

        logincat = loginCatCookieData;
    }
    // console.log(logincat);

    // Function to fetch subscription data for the site.
    const getSiteInfoData = async (siteId) => {                
        try {            
            const response = await getSiteInfo(siteId);            
            if (response?.data?.length > 0) {
                const siteInfo = response.data[0]; 
                setIsProduction(siteInfo.isProduction);
                setIsMopita(false);
                // setIsMopita(siteInfo.isMopita);
            }
            
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };  
    
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
            // setLoginData(tempData);
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
            getSiteInfoData(siteId);
            getSubscriptionData(siteId);             
            getLoginData(siteId);                                         
            getNotifications(siteId);
            getAnnouncements(siteId);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };


    useEffect(() => {
        getSiteInformation();        
    }, []); 

    // Main render function for the landing page.
    // isLogin = true;
    // console.log('isProduction: ',isProduction);
    // console.log('isMopita: ',isMopita);

    
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

            {/* Show SubscriptionButton if auth is false or if auth is true but not subscribed */}
            {subscriptionData
                .filter(option => !skippableCategories.includes(option.category))
                .map((option, index) =>
                    isMopita ? (
                        <SubscriptionButton key={index} data={option} user={userId} />
                    ) : (
                        <ShortcutSubscription key={index} data={option} user={userId} isLogin={isLogin}/>
                    )
                )
            }

            {/* Show TopPageComponent if user is authenticated and subscribed */}
            {isLogin && isMember && (
                <>
                    <div style={{textAlign:'center'}}>
                        <h2>BDGuardメンバーシップページへ</h2>
                        <p style={{fontSize:'16px',marginTop:'30px'}}>
                        ライセンスキーの確認とアプリのダウンロードは、下記の「会員ページ」から行ってください。
                        </p>
                    </div>
                    {skippableResources.map((item,index)=><TopPageComponent ci={item.ci} servicename={item.servicename}/>)}
                </>  
            )}
           
            {!isLogin ? (
                isMopita ? (
                    loginData.map((option, index) => (
                        <LoginButton key={index} data={option} />
                    ))
                ) : (                    
                    loginData.map((option, index) => (
                        <ShortcutLogin key={index} data={option}/>
                    ))
                )
            ) : (
                <LogoutButton />
            )}
         

        </Layout>
    );
}
