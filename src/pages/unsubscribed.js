import { useEffect,useState } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribed component
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";


// Logout components.
import LogoutButton from '@/components/site/logoutbutton/logoutbutton';

// API utility functions for fetching data.
import { fetchSubscriptionData,getServiceList } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";

// Server-side function to fetch initial props during SSR.
export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;

    // Extract user ID (uid) from the query parameters.
    let uid = query.uid;
    // uid = '279d0664343d1bba04';
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



export default function UnsubscribedPage({isLogin,userId}) {
    const router = useRouter();
    


    useEffect(() => {
        // If user is not logged in, redirect the user to the login page.
        if(!isLogin){
            router.push('/');
        }        

    },[router]);
    
    return (
        // Main layout wrapping the page structure.
        <Layout>       
            {/* Render unsubscribed components */}           
            <UnsubscribedComponent  />        
            {isLogin && <LogoutButton />}                     
        </Layout>
    );
}
