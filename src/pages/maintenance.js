// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// annuancement component
import Maintenance from "@/components/site/maintenance/maintenancecomponent";

export default function MaintenancePage() {

    return (
        // Main layout wrapping the page structure.
        <Layout globalData={{}}>
            {/* Render annuancement component */}                    
            <Maintenance  />            
        </Layout>
    );
}
