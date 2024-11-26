// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// annuancement component
import Maintenance from "@/components/site/maintenance/maintenancecomponent";

export default function MaintenancePage() {

    return (
        <Layout>                  
            <Maintenance  />            
        </Layout>
    );
}
