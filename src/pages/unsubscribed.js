// Import the Layout component
import Layout from "@/components/site/layout/layout";
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function UnsubscribedPage({ globalData }) {
    const router = useRouter();
    // useEffect(() => {
    //     if(!globalData.auth){
    //         router.push('/');
    //     }
    // }, [router]);

    return (
        <Layout globalData={globalData}>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
