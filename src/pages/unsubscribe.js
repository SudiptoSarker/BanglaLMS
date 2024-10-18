// Import the Layout component
import Layout from "@/components/site/layout/layout";
import InformationSection from "@/components/site/information/informationcomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import { fetchSubscriptionLoginData,getSiteId } from "@/components/api/queryApi";

export default function UnsubscribePage({ globalData }) {
    // Demo URLs to pass as props
    const noticeLink = '/notice'; // Replace with your desired URL
    const maintenanceLink = '/maintenance'; // Replace with your desired URL
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            router.push('/');
        }
    }, [router]);

    const [domain, setDomain] = useState("");
    const [unSubscriptionData, setUnubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);


    useEffect(() => {
        // Get the domain name when the component mounts
        if (typeof window !== "undefined") {
            const currentDomain = window.location.hostname;
            setDomain(currentDomain);
            console.log("Current domain:", currentDomain); // For debugging
        }
        }, []); // This useEffect runs only once, when the component mounts
    
        useEffect(() => {
        // Fetch subscription data once the domain is set
        if (domain) {
            const getSiteInformation = async () => {
                try {
                    const siteIdResult = await getSiteId(domain);
                    if (!siteIdResult) {
                        throw new Error(`Site with name '${domain}' not found.`);
                    }
                    
                    const siteId = siteIdResult.data[0]?.id;
                    console.log("Extracted site ID:", siteId);
                    getSubscriptionData(siteId);       
                    getLoginData(siteId);        
                } catch (error) {
                    console.log("Error fetching subscription data:", error);
                }
            };
            
            const getSubscriptionData = async (siteId) => {
            try {            
                const response = await fetchSubscriptionLoginData(siteId,"unsubscriptionbutton");
                setUnubscriptionData(response.data);
            } catch (error) {
                console.log("Error fetching subscription data:", error);
            }
            };
            const getLoginData = async (siteId) => {
                try {            
                    const response = await fetchSubscriptionLoginData(siteId,"loginbutton");
                    setLoginData(response.data);
                } catch (error) {
                    console.log("Error fetching subscription data:", error);
                }
            };
            getSiteInformation();
        }
    }, [domain]);  

        
    return (
        <Layout globalData={globalData}>                      
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
