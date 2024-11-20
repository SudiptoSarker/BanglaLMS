// React core imports for managing component state and side effects.
import { useEffect,useState } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribe component
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";

// API utility functions for fetching data.
import { fetchSubscriptionData } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';
import Cookies from 'js-cookie'; 

export default function UnsubscribePage() {
    const router = useRouter();

    // State variables to store data sets.
    const [unSubscriptionData, setUnubscriptionData] = useState([]);

    // Effect hook to check authentication on page load.
    useEffect(() => {
        // Check if authentication cookies are set.
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        
        // If authentication cookies are missing, redirect the user to the login page.
        if(!authCookie){
            router.push('/');
        }
    }, [router]);    

    // Effect hook to fetch the unsubscription data.
    useEffect(() => {
        // Call function to fetch site-related information.
        getSiteInformation();
    }, []);  

    // Function to fetch all required site-related information.
    const getSiteInformation = async () => {
        try {                    
            const siteId = await siteid();
            getSubscriptionData(siteId);       
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Function to fetch unsubscription-related data based on the site ID.
    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionData(siteId,"unsubscriptionbutton");
            setUnubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    // Render the unsubscribe page with fetched data.
    return (
        // Main layout wrapping the page structure.
        <Layout globalData={{}}>     
            {/* Render each unsubscription option using the UnsubscribeComponent. */}                 
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
