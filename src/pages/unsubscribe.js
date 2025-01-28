// React core imports for managing component state and side effects.
import { useEffect,useState } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribe component
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";

// API utility functions for fetching data.
import { fetchSubscriptionData,getServiceList } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";
import LogoutButton from "@/components/site/logoutbutton/logoutbuttoncomponent";

// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;

    // Extract user ID (uid) from the query parameters.
    let uid = query.uid;

    // dev
    // uid = '279d0664343d1bba04';

    // Validate the user ID: null check,char length check, empty check.
    isLogin = validateUserId(uid);
    
    // Pass the login status as a prop to the component.
    return { props: {
        isLogin: isLogin,
        userId: uid || null
    } };
}

// Main functional component for the Unsubscribe page.
export default function UnsubscribePage({isLogin,userId}) {
    const router = useRouter();

    // State variables to store data sets.
    const [unSubscriptionData, setUnubscriptionData] = useState([]); 

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
            
            let subscribedData = response.data;
            const ciResponse = await getServiceList(siteId,userId);            
            const ciValues = ciResponse.data.map(item => item.ci);
            subscribedData = subscribedData.filter(item => ciValues.includes(item.ci));
            setUnubscriptionData(subscribedData);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    useEffect(() => {
        // If user is not logged in, redirect the user to the login page.
        if(!isLogin){
            // router.push('/');
        }
        // Call function to fetch site-related information.        
        getSiteInformation();

    },[router]);
    
    // Render the unsubscribe page with fetched data.
    return (
        // Main layout wrapping the page structure.
        <Layout>          
            {/* Render each unsubscription option using the UnsubscribeComponent. */}                               
            <UnsubscribeComponent data={unSubscriptionData} />
            <LogoutButton />              
        </Layout>
    );
}
