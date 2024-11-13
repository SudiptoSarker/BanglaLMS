// Import the Layout component
import Layout from "@/components/site/layout/layout";
import Maintenance from "@/components/site/maintenance/maintenancecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function MaintenancePage() {

    return (
        <Layout globalData={{}}>                  
            <Maintenance  />            
        </Layout>
    );
}
