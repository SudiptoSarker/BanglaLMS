// Import the Layout component
import Layout from "@/components/site/layout/layout";
import Maintenance from "@/components/site/maintenance/maintenancecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home({ globalData }) {
    // Demo URLs to pass as props
    const noticeLink = '/notice'; // Replace with your desired URL
    const maintenanceLink = '/maintenance'; // Replace with your desired URL
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            // router.push('/');
        }
    }, [router]);

    return (
        <Layout globalData={globalData}>                  
            <Maintenance  />            
        </Layout>
    );
}
