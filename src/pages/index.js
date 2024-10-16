// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import { useState,useEffect } from 'react';

// import { fetchSubscriptionData } from "../api/queryApi";
// const [cookieData,setCookieData] = useState(null);

export default function Home() {
    // Demo URLs to pass as props
    const noticeLink = 'https://example.com/notice'; // Replace with your desired URL
    const maintenanceLink = 'https://example.com/maintenance'; // Replace with your desired URL

    const [subscriptionData, setSubscriptionData] = useState([]);
    const [domain, setDomain] = useState("");


    useEffect(()=>{
        // let cookieValue = Cookies.get('iai_mtisess_secure');
        // if(cookieValue!=null || cookieValue !='' || cookieValue!=undefined){
        //   setCookieData(cookieValue);
        // }
    // Get the domain name when the component mounts
        if (typeof window !== "undefined") {
            const currentDomain = window.location.hostname;
            setDomain(currentDomain);
            console.log("Current domain:", currentDomain); // For debugging
        }
        
        const getSubscriptionData = async () => {
          try {
            const response = await fetchSubscriptionData();
            setSubscriptionData(response.data);
          } catch (error) {
            console.log("Error fetching subscripton data:", error);
          }
        }
        getSubscriptionData();
    
      },[]);

    return (
        <Layout>  
            <InformationSection 
                noticeLink={noticeLink} 
                maintenanceLink={maintenanceLink} 
            />
            <br />
            <br />
            <FeatureSection  />
            <SubscriptionInfo  />
            <SubscriptionButton  />
            {subscriptionData.map((option, index) => (
                <SubscriptionButton key={index} data={option} />
            ))}
            <LoginButton  />          
        </Layout>
    );
}
