// React core imports for managing component state and side effects.
import { useEffect,useState } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribe component
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";

// API utility functions for fetching data.
import { fetchSubscriptionData } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";

// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;

    // Extract user ID (uid) from the query parameters.
    let uid = query.uid;

    // Validate the user ID: null check,char length check, empty check.
    isLogin = validateUserId(uid);
    
    // Pass the login status as a prop to the component.
    return { props: {
        isLogin: isLogin
    } };
}

// Main functional component for the Unsubscribe page.
export default function UnsubscribePage({isLogin}) {
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
        setUnubscriptionData(response.data);
    } catch (error) {
        console.log("Error fetching subscription data:", error);
    }
    };

    useEffect(() => {
        // If user is not logged in, redirect the user to the login page.
        if(!isLogin){
            router.push('/');
        }
        // Call function to fetch site-related information.
        getSiteInformation();
    },[router]);
    
    // Render the unsubscribe page with fetched data.
    return (
        // Main layout wrapping the page structure.
        <Layout>          
            {/* Render each unsubscription option using the UnsubscribeComponent. */}                   
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
