// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";

export default function Home() {
    // Demo URLs to pass as props
    const noticeLink = 'https://example.com/notice'; // Replace with your desired URL
    const maintenanceLink = 'https://example.com/maintenance'; // Replace with your desired URL

    return (
        <Layout>  
            <InformationSection 
                noticeLink={noticeLink} 
                maintenanceLink={maintenanceLink} 
            />
            <br />
            <br />
            <FeatureSection  />
            <SubscriptionInfo  />
            <SubscriptionButton  />
            <LoginButton  />          
        </Layout>
    );
}
