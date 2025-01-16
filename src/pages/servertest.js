'use client'
// React core imports for managing component state and side effects.
import { useEffect, useState } from "react";
// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";
// Header component
import HeaderComponent from "@/components/site/header/headercomponent";
import { CookiesProvider } from "react-cookie";

// Helper utilities.
import { siteid,validateUserId,isNullOrEmpty,checkSubscriptionByService } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";
import { getSiteInfo,updateLicenseKey,getLicenseList,deactivateLicenseInSourceTable } from "@/components/api/queryApi";


// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let uid = query.uid;
    let ci = query.ci;


    // dev
    // uid = '279d0664343d1bba04';

    let isLogin = false;
    let isMember = false;
    let licenseKey = '';
    let siteId = await siteid();
    
    // Validating User ID
    isLogin = validateUserId(uid);

    //dev
    //isLogin = true;

    if(isLogin){

        if(!isNullOrEmpty(ci)){
            const subscriptionData =  await checkSubscriptionByService(uid,ci);
            if(subscriptionData != null && subscriptionData != undefined){
                isMember = true;
                if(subscriptionData.licensekey != null){
                    licenseKey = subscriptionData.licensekey;
                }
                else{
                    try{
                        let siteDataList = await getSiteInfo(siteId);
                        let siteData = siteDataList.data[0];
        
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

    // Pass the login status as a prop to the component.
    return { props: {
        isLogin: isLogin,
        isMember: isMember,
        licenseKey: licenseKey
    } };
}

export default function ServerTest({isLogin,isMember,licenseKey}) {     
    const router = useRouter(); // Router instance for navigation control.


    const handleGet = async()=>{
        const user_agent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36`;
        const res = await fetch(encodeURIComponent('https://devservice.mopita.com/iai-api/pub/payment.get_paytype_list?iai_rid=R000002750&iai_muid=279d0664343d1bba04&iai_src_mrkt=MKT00001&iai_uagt='+user_agent),{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf8',
                'X-Mti-Source-Id': 'S00313',
                'X-Iai-Remote-Addr': '52.173.141.239'
            }
        }
        );
        let result = await res.json();
        console.log(result);
    }

    const handlePost = async()=>{
        const res = await fetch('https://devservice.mopita.com/iai-api/pub/payment.get_paytype_list', {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Mti-Source-Id': 'S00313',
              'X-Iai-Remote-Addr': '52.173.141.239'
            },
            method:'POST',
            body:{
                'iai_rid':'R000002750',
                'iai_muid':'279d0664343d1bba04',
                'iai_src_mrkt': 'MKT00001',
                'iai_uagt':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            }
          });

          let result = await res.json();
          console.log(result);
    }
    const handleAPI = async()=>{
        const res = await fetch('/api/mopita-api');

        let result = await res.json();
        console.log(result);
    }


    useEffect(() => {
        if(!isLogin){
            router.push('/');
        }
        
    }, [router]);

    return (
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout>  
                {/* Show MemberPageComponent only if authenticated and subscribed to the service */}
                {isLogin && (
                    <>
                        <button onClick={handleGet} style={{padding:'10px',marginRight:'10px'}}>get request</button>
                        <button onClick={handlePost} style={{padding:'10px',marginRight:'10px'}}>post request</button>
                        <button onClick={handleAPI} style={{padding:'10px',marginRight:'10px'}}>API request</button>
                    </>
                )} 
                {/* Header section */}
                <HeaderComponent  />                                       
            </Layout>
        </CookiesProvider>
    );
}
