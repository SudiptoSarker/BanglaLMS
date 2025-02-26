'use client'
import { useEffect, useState } from "react";
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import MemberPageComponent from "@/components/site/member/memberpagecomponent";
import AnshinStoreQRCode from "@/components/site/anshinstore/qrcode";

// Logout components.
import LogoutButton from '@/components/site/logoutbutton/logoutbutton';

import { fetchSubscriptionData, fetchNotificationsAndAnnouncements } from "@/components/api/queryApi";
import Cookies from 'js-cookie';
import { siteid,validateUserId,isNullOrEmpty,checkSubscriptionByService } from '@/helper/helper';
import { useRouter } from "next/router";
import { getSiteInfo,updateLicenseKey,getLicenseList,deactivateLicenseInSourceTable } from "@/components/api/queryApi";
import styles from '../components/site/member/memberpage.module.css';
export async function getServerSideProps(context) {
    const {req, query} = context;
    let uid = query.uid;  
    //dev testing
    // uid = '279d0664343d1bba04';  
    let ci = query.ci;
    //dev testing
    // ci = "R000002770";   
    let logincat = query.logincat || null;
    let ordid = query.ordid || null;    
    let isLogin = false;
    let isMember = false;
    let isMopita = true;
    let siteMode = 0;
    let licenseKey = '';    
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
        isMopita:isMopita,
        ordid:ordid,
        siteMode:siteMode,
    } };
}

export default function MemberPage({isLogin,logincat,isMember,licenseKey,isMopita,ordid,siteMode}) {           
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);    
    const [isAfterApiSucess, setIsAfterApiSucess] = useState(true);     
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    let loginCatCookieData = Cookies.get('logincat') || null;
    if(logincat){
        Cookies.set('logincat', logincat, { expires: 7, sameSite: 'strict' });
    }else{

        logincat = loginCatCookieData;
    }

    const getAfterPaymentData = async (siteMode,ordid) => {        
        try {
            let afterPayResponse = await fetch(
                `/api/mopita/afterpay?siteMode=${siteMode}&order=${encodeURIComponent(ordid)}`
            );                                              
            const afterPayData = await afterPayResponse.json();                         
            if (afterPayData?.result?.result?.code === "I000") {                                                    
                setIsAfterApiSucess(true);
            } else {
                setIsAfterApiSucess(false);
            }
        } catch (error) {
            console.error("Error in payment processing:", error);
            setIsAfterApiSucess(false);
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
        setIsPageLoaded(false); 
        try {
            const siteId = await siteid();
            
            if(!isMopita && ordid){
                getAfterPaymentData(siteMode,ordid);
            }

            getNotifications(siteId);
            getAnnouncements(siteId);
            setTimeout(() => {
                setIsPageLoaded(true);
            }, 1000);
            
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
            {!isPageLoaded ? (
                <div className={styles.loaderContainer}>
                    <img src="/loader.gif" alt="Loading..." className={styles.loader} />
                </div>
            ) : isAfterApiSucess ? (
                <>                    
                    {isLogin && isMember && (
                        <>
                            <MemberPageComponent licenseKey={licenseKey} />
                            <AnshinStoreQRCode licenseKey={licenseKey} />
                        </>
                    )}


                    <HeaderComponent />
                    {notifications.map((notification, index) => (
                        <NotificationComponent key={index} text={notification.text} href={notification.link} />
                    ))}
                    {announcements.map((announcement, index) => (
                        <AnnounceComponent key={index} {...announcement} />
                    ))}
                    <FeatureSection />
                    <div className={styles.buttonContainer}>
                        <button className={styles.backButton} type="button" onClick={() => router.push('/top')}>
                            Top
                        </button>
                    </div>
                    {isLogin && <LogoutButton />}
                </>
            ) : (
                <>
                    <div className={styles.errorMessage}>
                        <p>⚠️ Something went wrong. Please try again later.</p>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.backButton} type="button" onClick={() => router.push('/top')}>
                            Top
                        </button>
                    </div>
                    {isLogin && <LogoutButton />}
                </>
            )}            
        </Layout>
    );
}