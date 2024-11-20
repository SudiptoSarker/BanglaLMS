// React core imports for managing component state and side effects.
import { useEffect } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribed component
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";

// Router for handling client-side navigation in Next.js.
import { useRouter } from "next/router";
import Cookies from 'js-cookie'; 

export default function UnsubscribedPage() {
    const router = useRouter();

    // Effect hook to check authentication on page load.
    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/');
        }
    }, [router]);

    return (
        // Main layout wrapping the page structure.
        <Layout globalData={{}}>              
            {/* Render unsubscribed components */}    
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
