// Import the Layout component
import Layout from "@/components/site/layout/layout";
import Maintenance from "@/components/site/maintenance/maintenancecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function MaintenancePage({ globalData }) {
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
