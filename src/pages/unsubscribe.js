import Layout from "@/components/site/layout/layout";
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import { fetchSubscriptionLoginData,getSiteId } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';
import Cookies from 'js-cookie'; 

export default function UnsubscribePage() {
    const router = useRouter();
    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/');
        }
    }, [router]);
    const [unSubscriptionData, setUnubscriptionData] = useState([]);

    const domain = process.env.NEXT_PUBLIC_DOMAIN;

    useEffect(() => {
        // Fetch subscription data once the domain is set
        if (domain) {
            const getSiteInformation = async () => {
                try {                    
                    const siteId = await siteid();
                    getSubscriptionData(siteId);       
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
            getSiteInformation();
        }
    }, [domain]);  

        
    return (
        <Layout globalData={{}}>                      
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
