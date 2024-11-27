// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

// Notice component
import Instructions from "@/components/site/notice/noticecomponent";

export default function NoticePage() {

    return (
        // Main layout wrapping the page structure.
        <Layout>          
            {/* Render notice component */}            
            <Instructions  />            
        </Layout>
    );
}
