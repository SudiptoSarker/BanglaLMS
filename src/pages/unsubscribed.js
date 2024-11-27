// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribed component
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";

export default function UnsubscribedPage() {
    return (
        // Main layout wrapping the page structure.
        <Layout>       
            {/* Render unsubscribed components */}           
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
