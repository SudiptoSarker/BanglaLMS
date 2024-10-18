// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function UnsubscribedPage({ globalData }) {
    // Demo URLs to pass as props
    const noticeLink = '/notice'; // Replace with your desired URL
    const maintenanceLink = '/maintenance'; // Replace with your desired URL
    const router = useRouter();
    useEffect(() => {
        // console.log('auth: ',globalData.auth);
        // console.log('isSubscribed: ',globalData.isSubscribed);
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);

    return (
        <Layout globalData={globalData}>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
