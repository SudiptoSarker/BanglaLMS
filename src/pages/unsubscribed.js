// React core imports for managing component state and side effects.
import { useEffect } from "react";

// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Unsubscribed component
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";

export default function UnsubscribedPage() {
    return (
        <Layout>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
