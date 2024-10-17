// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import TopPageComponent from "@/components/site/top/toppagecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home({ globalData }) {
    // Demo URLs to pass as props
    const noticeLink = 'https://example.com/notice'; // Replace with your desired URL
    const maintenanceLink = 'https://example.com/maintenance'; // Replace with your desired URL
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);

    return (
        <Layout globalData={globalData}>  
            <InformationSection 
                noticeLink={noticeLink} 
                maintenanceLink={maintenanceLink} 
            />
            <br />
            <br />
            <FeatureSection  />            
            <TopPageComponent  />            
            <br />
        </Layout>
    );
}
