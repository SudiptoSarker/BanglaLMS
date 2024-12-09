// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// annuancement component
import ErrorHandling from "@/components/site/maintenance/404component";

export default function MaintenancePage() {

    return (
        // Main layout wrapping the page structure.
        <Layout>                 
            {/* Render annuancement component */}         
            <ErrorHandling  />            
        </Layout>
    );
}
