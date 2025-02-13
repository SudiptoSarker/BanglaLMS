'use client'
import { useEffect, useState } from "react";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import MemberPageComponent from "@/components/site/member/memberpagecomponent";

// Logout components.
import LogoutButton from '@/components/site/logoutbutton/logoutbuttoncomponent';

import { fetchSubscriptionData, fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import Cookies from 'js-cookie';
import { siteid,validateUserId,isNullOrEmpty,checkSubscriptionByService } from '@/helper/helper';
import { useRouter } from "next/router";
import { getSiteInfo,updateLicenseKey,getLicenseList,deactivateLicenseInSourceTable } from "@/components/api/queryApi";
import styles from '../components/site/member/memberpage.module.css';
export async function getServerSideProps(context) {
    const {req, query} = context;
    let uid = query.uid;  
    uid = '279d0664343d1bba04';  
    let ci = query.ci;
    ci = "R000002770";   
    let logincat = query.logincat || null;
    let ordid = query.ordid || null;    
    let isLogin = false;
    let isMember = false;
    let isMopita = true;
    let siteMode = 0;
    let licenseKey = '';
    let isAfterApiSucess = true;
    let siteId = await siteid(); 
    isLogin = validateUserId(uid);

    if(isLogin){
        let siteDataList = await getSiteInfo(siteId);                        
        let siteData = siteDataList.data[0];   
        isMopita = siteData.isMopita;              
        siteMode = siteData.isProduction ? 1 : 0;
        if(!isNullOrEmpty(ci)){
            const subscriptionData =  await checkSubscriptionByService(uid,ci);
            
            if(subscriptionData != null && subscriptionData != undefined){
                isMember = true;               
                if(!isMopita && ordid){    
                    const baseURL = `https://${process.env.NEXT_PUBLIC_DOMAIN}`;
                    try {
                        let afterPayResponse = await fetch(
                            `${baseURL}/api/mopita/afterpay?siteMode=${siteMode}&order=${ordid}`
                        );                                                                   
                                            
                //         const afterPayData = await afterPayResponse.json(); // Parse response                                       
                //         if (afterPayData?.result?.result?.code === "I000") {                                    
                //             // if (afterPayData.result.buyid === subscriptionData.orderId) {
                //             //     isAfterApiSucess = true;
                //             // } else {
                //             //     isAfterApiSucess = false;
                //             // }
                //             isAfterApiSucess = true;
                //         } else {
                //             isAfterApiSucess = false;
                //         }
                //     } catch (error) {
                //         console.error("Error in payment processing:", error);
                //         isAfterApiSucess = false;
                //     }            
                // }
                // else{
                //     isAfterApiSucess = true;
                // }

                if(subscriptionData.licensekey != null){                    
                    licenseKey = subscriptionData.licensekey;
                }
                else{
                    try{
                                                     
                        if(siteData.source.toLowerCase() == 'webapi'){                            
                            let _url = siteData.reglink;                                    
                            _url = _url.replace('{cs}',subscriptionData.cs);
                            _url = _url.replace('{ci}',subscriptionData.ci);
                            _url = _url.replace('{uid}',uid);
                            _url = _url.replace('{act}','reg');
        
                            let queryString = _url.substring(_url.indexOf('?')+1,_url.length);
        
                            const response = await fetch(_url, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json',
                                },
                                query: queryString
                            });
        
                            let result = await response.json();
                            if(result.success){
                                let updateResult = await updateLicenseKey(subscriptionData.Id,result.key,result.validity);
                                if(updateResult.data[0].affectedRow){
                                    licenseKey = result.key;
                                }
                            }
                        }
                        else{
                            let licenseData = await getLicenseList(siteId,subscriptionData.ci);
                            if(licenseData.data.length > 0){
                                let _validity = new Date(licenseData.data[0].validity).toISOString().split('T')[0];
                                
                                let updateResult = await updateLicenseKey(subscriptionData.Id,licenseData.data[0].licensekey,_validity);
    
                                if(updateResult.data[0].affectedRow > 0){
                                    let deactivateResult = await deactivateLicenseInSourceTable(licenseData.data[0].id,siteId);
                                    licenseKey = licenseData.data[0].licensekey;
                                }
                            }
                        }
                    }
                    catch(error){
                        console.log(error);
                        licenseKey = 'You have already subscribed, but license key is unavailable right now. Please try again later.';
                    }                       
                }
                
            }
        }
    }  

    return { props: {        
        isLogin: isLogin,
        logincat: logincat,
        isMember: isMember,
        licenseKey: licenseKey,
        isAfterApiSucess:isAfterApiSucess,
    } };
}

export default function MemberPage({isLogin,logincat,isMember,licenseKey,isAfterApiSucess}) {           
    const router = useRouter(); // Router instance for navigation control.
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);    

    let loginCatCookieData = Cookies.get('logincat') || null;
    if(logincat){
        Cookies.set('logincat', logincat, { expires: 7, sameSite: 'strict' });
    }else{

        logincat = loginCatCookieData;
    }

    const getAfterPaymentData = async (ordid) => {
        try {
            let afterPayResponse = await fetch(
                `https://stgbanglalms.mopita.com/api/mopita/afterpay?siteMode=${siteMode}&order=${ordid}`
            );                                                                   
                                
            const afterPayData = await afterPayResponse.json(); // Parse response                                       
            if (afterPayData?.result?.result?.code === "I000") {                                    
                // if (afterPayData.result.buyid === subscriptionData.orderId) {
                //     isAfterApiSucess = true;
                // } else {
                //     isAfterApiSucess = false;
                // }
                isAfterApiSucess = true;
            } else {
                isAfterApiSucess = false;
            }
        } catch (error) {
            console.error("Error in payment processing:", error);
            isAfterApiSucess = false;
        }    
    };

    // Fetch subscription data from the API.
    const getSubscriptionData = async (siteId) => {
        try {
            const response = await fetchSubscriptionData(siteId, "DeviceSubscriptionButton");
            setSubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Fetch notifications data from the API.
    const getNotifications = async (siteId) => {
        try {
          const data = await fetchNotificationsAndAnnouncements(siteId,"notificationbanner");                  
          setNotifications(data.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
    };

    // Fetch announcements data from the API.
    const getAnnouncements = async (siteId) => {
        try{
          const data = await fetchNotificationsAndAnnouncements(siteId,"announcebanner");                  
          setAnnouncements(data.data);
        }catch(error) {
          console.error("Error fetching announcements:", error);
        }
    };

    // Retrieve all site information (subscription, notifications, announcements).
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

    useEffect(() => {
        if(!isLogin){
            router.push('/');
        }
        if(!isMember){
            router.push('/top');
        }
        getSiteInformation();
    }, [router]);
  
    return (
        <Layout>  
            {isAfterApiSucess ? (
            <>
                {/* Show MemberPageComponent only if authenticated and subscribed to the service */}
                {isLogin && isMember && (
                    <MemberPageComponent licenseKey={licenseKey} />  
                )} 

                {/* Header section */}
                <HeaderComponent  />   

                {/* Notification section */}          
                {notifications.map((notification, index) => (
                    <NotificationComponent
                    key={index}
                    text={notification.text}
                    href={notification.link}
                    />
                ))}    

                {/* Announcement section */}                                                
                {announcements.map((announcement, index) => (
                    <AnnounceComponent 
                        key={index}
                        {...announcement}          
                    />
                ))}

                {/* Feature section */}        
                <FeatureSection  />                              

                <div className={styles.buttonContainer}>
                    {/* Back button to return to the previous page */}
                    <button
                        className={styles.backButton}
                        type="button"
                        onClick={() => router.push('/top')}
                    >
                        Top
                    </button>                       
                </div>    
            </>
            ) : (              
                <>                    
                    <div className={styles.errorMessage}>
                        <p>⚠️ Something went wrong. Please try again later.</p>
                    </div>

                    <div className={styles.buttonContainer}>
                    {/* Back button to return to the previous page */}
                    <button
                        className={styles.backButton}
                        type="button"
                        onClick={() => router.push('/top')}
                    >
                        Top
                    </button>                       
                </div>  
                </>  
            )}   
            
            {isLogin && <LogoutButton />}
        </Layout>
    );
}
