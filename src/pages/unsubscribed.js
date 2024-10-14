// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";


export default function Home() {
    // Demo URLs to pass as props
    const noticeLink = 'https://example.com/notice'; // Replace with your desired URL
    const maintenanceLink = 'https://example.com/maintenance'; // Replace with your desired URL

    return (
        <Layout>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
